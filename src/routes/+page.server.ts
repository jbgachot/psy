import type { PageServerLoad } from './$types';
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';
import clusters, { type Cluster, type Node, type Pod, type Container } from '$src/lib/stores/cluster';

export const load: PageServerLoad = async () => {
	const kc = new KubeConfig();
	kc.loadFromDefault();
	const k8sApi = kc.makeApiClient(CoreV1Api);

	// Get current context name
	const contextName = kc.getCurrentContext() || 'unknown-context';

	try {
		// First, get nodes to ensure cluster access
		const nodes = await k8sApi.listNode();
		console.log('Nodes response type:', typeof nodes);

		if (!nodes?.items) {
			console.error('Cannot access cluster - invalid nodes response');
			return { clusters: {} };
		}

		// Get pods with proper error handling
		const pods = await k8sApi.listPodForAllNamespaces();

		if (!pods?.items) {
			console.error('No items in pods response');
			return { clusters: {} };
		}

		const podsItems = pods.items || [];
		const nodesItems = nodes.items || [];

		// Filter only running pods
		const runningPodsItems = podsItems.filter(pod =>
			pod.status?.phase === 'Running' &&
			pod.status?.containerStatuses?.every(status => status.ready)
		);

		console.log('API Response:', {
			totalPodsCount: podsItems.length,
			runningPodsCount: runningPodsItems.length,
			nodesCount: nodesItems.length
		});

		// Find maximum node CPU capacity
		const nodeCPUCapacities: { [key: string]: number } = {};
		let maxNodeCPU = 0;

		// First pass: get all CPU capacities and find max
		nodesItems.forEach(node => {
			if (!node?.metadata?.name) return;
			const nodeName = node.metadata.name;
			const allocatable = node.status?.allocatable || {};
			const cpuCapacity = parseCPU(allocatable.cpu);
			nodeCPUCapacities[nodeName] = cpuCapacity;
			maxNodeCPU = Math.max(maxNodeCPU, cpuCapacity);
		});

		// Create cluster structure with context name
		const clusterData: { [key: string]: Cluster } = {
			[contextName]: {
				nodes: {}
			}
		};

		// Second pass: calculate relative node sizes
		nodesItems.forEach(node => {
			if (!node?.metadata?.name) return;
			const nodeName = node.metadata.name;
			const nodeCapacity = nodeCPUCapacities[nodeName];

			clusterData[contextName].nodes[nodeName] = {
				size: (nodeCapacity / maxNodeCPU) * 100, // Relative to largest node
				pods: {}
			};
		});

		// Track total pod CPU requests per node to calculate accurate percentages
		const nodeTotalRequests: { [key: string]: number } = {};

		// First pass: calculate total CPU requests per node from running pods
		runningPodsItems.forEach(pod => {
			const nodeName = pod.spec?.nodeName;
			if (!nodeName) return;

			nodeTotalRequests[nodeName] = nodeTotalRequests[nodeName] || 0;

			pod.spec?.containers.forEach(container => {
				const containerStatus = pod.status?.containerStatuses?.find(
					status => status.name === container.name
				);

				// Skip if container is not ready
				if (!containerStatus?.ready) return;

				const cpuRequest = parseCPU(container.resources?.requests?.cpu);
				nodeTotalRequests[nodeName] += cpuRequest;
			});
		});

		// Process running pods only
		runningPodsItems.forEach(pod => {
			try {
				const nodeName = pod.spec?.nodeName;
				const podName = pod.metadata?.name;
				const namespace = pod.metadata?.namespace;

				if (!nodeName || !podName || !namespace) {
					console.warn('Skipping pod with missing required fields:', { nodeName, podName, namespace });
					return;
				}

				if (!clusterData[contextName].nodes[nodeName]) {
					console.warn(`Node ${nodeName} not found for pod ${podName}`);
					return;
				}

				const podContainers: { [key: string]: Container } = {};
				let totalPodCPU = 0;

				// Process only running containers
				pod.spec?.containers.forEach(container => {
					const containerStatus = pod.status?.containerStatuses?.find(
						status => status.name === container.name
					);

					// Skip if container is not ready
					if (!containerStatus?.ready) return;

					const cpuRequest = parseCPU(container.resources?.requests?.cpu);
					const cpuLimit = parseCPU(container.resources?.limits?.cpu);
					totalPodCPU += cpuRequest;

					podContainers[container.name] = {
						size: 0,
						cpu: {
							request: cpuRequest,
							limit: cpuLimit
						},
						labels: pod.metadata?.labels || {},
						status: containerStatus?.state?.running ? 'Started'
							: containerStatus?.state?.waiting ? containerStatus.state.waiting.reason
								: containerStatus?.state?.terminated ? containerStatus.state.terminated.reason
									: 'Unknown',
						startDate: containerStatus?.state?.running?.startedAt || pod.status?.startTime || ''
					};
				});

				if (totalPodCPU > 0) {
					// Calculate container sizes as percentage of pod's total CPU
					Object.keys(podContainers).forEach(containerName => {
						const container = podContainers[containerName];
						container.size = (container.cpu.request / totalPodCPU) * 100;
					});

					// Calculate pod size as percentage of node capacity
					const nodeCPU = nodeCPUCapacities[nodeName] || 1;
					const podSize = (totalPodCPU / nodeCPU) * 100;

					// Log overcommitted nodes
					if (nodeTotalRequests[nodeName] > nodeCPU) {
						console.warn(`Node ${nodeName} is overcommitted: ${nodeTotalRequests[nodeName]}/${nodeCPU} CPU cores`);
					}

					clusterData[contextName].nodes[nodeName].pods[podName] = {
						size: podSize,
						containers: podContainers
					};
				}
			} catch (podError) {
				console.error('Error processing pod:', podError);
			}
		});

		clusters.set(clusterData);
		return { clusters: clusterData };
	} catch (err) {
		console.error('Error fetching cluster data:', err);
		if (err.response) {
			console.error('Response error:', {
				status: err.response.statusCode,
				body: JSON.stringify(err.response.body, null, 2)
			});
		} else {
			console.error('Error details:', err.message);
		}
		return { clusters: {} };
	}
};

// Helper function to parse CPU values
function parseCPU(cpu: string | undefined): number {
	if (!cpu) return 0;
	if (cpu.endsWith('m')) {
		return parseInt(cpu) / 1000;
	}
	return parseInt(cpu) || 0;
}
