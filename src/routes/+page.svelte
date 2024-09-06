<script lang="ts">
	import Cluster from '$src/lib/components/kubernetes/cluster.svelte';
	import { cluster } from '$src/lib/cluster';

	$: clusters = Object.entries($cluster);
</script>

<svelte:head>
	<title>Home - Pod Storage Yard</title>
	<meta name="description" content="Example of description" />
</svelte:head>

<h1>Welcome to Pod Storage Yard</h1>

{#each clusters as [clusterName, clusterContent]}
	<Cluster {clusterName} {clusterContent} />
{/each}
