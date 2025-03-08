<script lang="ts">
	import Node from '$src/lib/components/kubernetes/node.svelte';

	export let clusterName;
	export let clusterContent;

	$: nodes = Object.entries(clusterContent.nodes).map(([nodeName, nodeContent]) => {
		// Sort pods by size in descending order
		const sortedPods = Object.entries(nodeContent.pods)
			.sort(([, a], [, b]) => b.size - a.size)
			.reduce((acc, [podName, podContent]) => {
				acc[podName] = podContent;
				return acc;
			}, {});

		return [nodeName, { ...nodeContent, pods: sortedPods }];
	});
</script>

<div class="relative h-full">
	<p class="absolute right-1.5 bottom-1 z-50 text-xxs text-indigo-300">
		{clusterName}
	</p>
	<div class="p-2 overflow-auto max-h">
		{#each nodes as [nodeName, nodeContent]}
			<Node {nodeName} {nodeContent} />
		{/each}
	</div>
</div>
