<script lang="ts">
	import Container from '$src/lib/components/kubernetes/container.svelte';

	export let podName;
	export let podContent;

	$: containers = Object.entries(podContent.containers);
</script>

<div class="relative" style="width: {podContent.size}%;">
	<p class="absolute right-1.5 bottom-1 z-50 text-xxs text-indigo-900">
		{podName}
	</p>
	<div class="flex p-1 border-indigo-500 border-4 bg-indigo-400">
		{#each containers as [containerName, containerContent]}
			<Container {containerName} {containerContent} />
		{/each}
	</div>
</div>
