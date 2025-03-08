<script lang="ts">
	import Cluster from '$src/lib/components/kubernetes/cluster.svelte';
	import clustersStore from '$src/lib/stores/cluster';
	import Information from '$src/lib/components/information.svelte';

	export let data;
	$: clustersStore.set(data.clusters);
	$: clusters = Object.entries($clustersStore);
</script>

<svelte:head>
	<title>Home - Pod Storage Yard</title>
	<meta name="description" content="Example of description" />
</svelte:head>

<div class="relative h-full">
	<div class="absolute inset-0 overflow-auto p-4">
		{#each clusters as [clusterName, clusterContent]}
			<Cluster {clusterName} {clusterContent} />
		{/each}
	</div>

	<div class="fixed bottom-4 right-4 z-50">
		<Information />
	</div>
</div>

<style>
	:global(body) {
		overflow: hidden;
	}
</style>
