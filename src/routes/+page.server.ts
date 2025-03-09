import type { PageServerLoad } from './$types';
import { KubeConfig, CoreV1Api } from '@kubernetes/client-node';
import type { V1Pod, V1Node, V1Container, V1ContainerStatus } from '@kubernetes/client-node';
import type { Clusters, Container } from '$lib/types/kubernetes';

interface NodeCPUMap {
	[key: string]: number;
}

class KubernetesDataProcessor {
	private nodeCPUCapacities: NodeCPUMap = {};
	private maxNodeCPU = 0;

	private parseCPU(cpu: string | undefined): number {
		if (!cpu) return 0;
		if (cpu.endsWith('m')) return parseInt(cpu) / 1000;
		return parseInt(cpu) || 0;
	}

	private processNodeCapacities(nodes: V1Node[]): void {
		nodes.forEach(node => {
			if (!node?.metadata?.name) return;
			const cpuCapacity = this.parseCPU(node.status?.allocatable?.cpu);
			this.nodeCPUCapacities[node.metadata.name] = cpuCapacity;
			this.maxNodeCPU = Math.max(this.maxNodeCPU, cpuCapacity);
		});
	}

	private calculateNodeSizes(nodes: V1Node[], contextName: string): Clusters {
		const clusters: Clusters = { [contextName]: { nodes: {} } };

		nodes.forEach(node => {
			if (!node?.metadata?.name) return;
			const nodeCapacity = this.nodeCPUCapacities[node.metadata.name];

			clusters[contextName].nodes[node.metadata.name] = {
				size: (nodeCapacity / this.maxNodeCPU) * 100,
				pods: {}
			};
		});

		return clusters;
	}

	private processContainerStatus(
		container: V1Container,
		containerStatus: V1ContainerStatus | undefined,
		podLabels: Record<string, string> = {}
	): Container {
		const cpuRequest = this.parseCPU(container.resources?.requests?.cpu);
		const cpuLimit = this.parseCPU(container.resources?.limits?.cpu);
		const startDate = containerStatus?.state?.running?.startedAt
			? new Date(containerStatus.state.running.startedAt).toISOString()
			: '';

		return {
			size: 0, // Will be calculated later
			cpu: { request: cpuRequest, limit: cpuLimit },
			labels: podLabels,
			status: this.determineContainerStatus(containerStatus),
			startDate
		};
	}

	private determineContainerStatus(status: V1ContainerStatus | undefined): Container['status'] {
		if (!status) return undefined;
		if (status.state?.running) return 'Started';
		if (status.state?.waiting) return status.state.waiting.reason as Container['status'];
		if (status.state?.terminated) return status.state.terminated.reason as Container['status'];
		return undefined;
	}

	public async processClusterData(contextName: string): Promise<Clusters> {
		const kc = new KubeConfig();
		kc.loadFromDefault();
		const k8sApi = kc.makeApiClient(CoreV1Api);

		try {
			const [{ items: nodes }, { items: pods }] = await Promise.all([
				k8sApi.listNode(),
				k8sApi.listPodForAllNamespaces()
			]);

			if (!nodes?.length || !pods?.length) {
				console.warn('No resources found:', {
					nodesCount: nodes?.length ?? 0,
					podsCount: pods?.length ?? 0
				});
				return { [contextName]: { nodes: {} } };
			}

			const runningPods = pods.filter(pod =>
				pod.status?.phase === 'Running' &&
				pod.status?.containerStatuses?.every(status => status.ready)
			);

			this.processNodeCapacities(nodes);
			const clusters = this.calculateNodeSizes(nodes, contextName);

			// Process pods and add them to the cluster data
			runningPods.forEach(pod => this.processPod(pod, clusters[contextName]));

			return clusters;
		} catch (error) {
			console.error('Failed to process cluster data:', {
				error: error instanceof Error ? error.message : 'Unknown error',
				context: contextName
			});
			throw error;
		}
	}

	private processPod(pod: V1Pod, cluster: Clusters[string]): void {
		const nodeName = pod.spec?.nodeName;
		const podName = pod.metadata?.name;

		if (!nodeName || !podName || !cluster.nodes[nodeName]) return;

		const podContainers: Record<string, Container> = {};
		let totalPodCPU = 0;

		pod.spec?.containers.forEach(container => {
			const containerStatus = pod.status?.containerStatuses?.find(
				status => status.name === container.name
			);

			if (!containerStatus?.ready) return;

			const containerData = this.processContainerStatus(
				container,
				containerStatus,
				pod.metadata?.labels
			);

			totalPodCPU += containerData.cpu.request;
			podContainers[container.name] = containerData;
		});

		if (totalPodCPU > 0) {
			this.calculateContainerSizes(podContainers, totalPodCPU);
			this.addPodToNode(
				cluster.nodes[nodeName],
				podName,
				totalPodCPU,
				podContainers,
				nodeName
			);
		}
	}

	private calculateContainerSizes(
		containers: Record<string, Container>,
		totalPodCPU: number
	): void {
		Object.values(containers).forEach(container => {
			container.size = (container.cpu.request / totalPodCPU) * 100;
		});
	}

	private addPodToNode(
		node: Clusters[string]['nodes'][string],
		podName: string,
		totalPodCPU: number,
		containers: Record<string, Container>,
		nodeName: string
	): void {
		const nodeCPU = this.nodeCPUCapacities[nodeName] || 1;
		node.pods[podName] = {
			size: (totalPodCPU / nodeCPU) * 100,
			containers
		};
	}
}

export const load: PageServerLoad = async () => {
	const contextName = new KubeConfig().getCurrentContext() || 'unknown-context';

	try {
		const processor = new KubernetesDataProcessor();
		const clusters = await processor.processClusterData(contextName);
		return { clusters };
	} catch (error) {
		console.error('Error in page load:', error);
		return { clusters: {} };
	}
};
