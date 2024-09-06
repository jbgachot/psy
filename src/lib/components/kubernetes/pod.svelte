<script lang="ts">
	import Container from '$src/lib/components/kubernetes/container.svelte';

	export let podName;
	export let podContent;

	$: containers = Object.entries(podContent);
</script>

<div>
	<h3>{podName}</h3>
	{#each containers as [containerName, containerContent]}
		<Container {containerName} {containerContent} />
	{/each}
</div>
