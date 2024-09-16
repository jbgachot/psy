<script lang="ts">
	import Cluster from '$src/lib/components/kubernetes/cluster.svelte';
	import { cluster } from '$src/lib/stores/cluster';
	import Information from '$src/lib/components/information.svelte';

	$: clusters = Object.entries($cluster);
</script>

<svelte:head>
	<title>Home - Pod Storage Yard</title>
	<meta name="description" content="Example of description" />
</svelte:head>

<Information />

{#each clusters as [clusterName, clusterContent]}
	<Cluster {clusterName} {clusterContent} />
{/each}

<style>
</style>
