<script lang="ts">
	import Node from '$src/lib/components/kubernetes/node.svelte';

	export let clusterName;
	export let clusterContent;

	$: nodes = Object.entries(clusterContent);
</script>

<div>
	<h3>{clusterName}</h3>
	{#each nodes as [nodeName, nodeContent]}
		<Node {nodeName} {nodeContent} />
	{/each}
</div>
