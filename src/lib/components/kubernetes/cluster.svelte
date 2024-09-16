<script lang="ts">
	import Node from '$src/lib/components/kubernetes/node.svelte';

	export let clusterName;
	export let clusterContent;

	$: nodes = Object.entries(clusterContent.nodes);
</script>

<div class="relative">
	<p class="absolute right-1.5 bottom-1 z-50 text-xxs text-indigo-300">
		{clusterName}
	</p>
	<div class="p-2 bg-indigo-700">
		{#each nodes as [nodeName, nodeContent]}
			<Node {nodeName} {nodeContent} />
		{/each}
	</div>
</div>
