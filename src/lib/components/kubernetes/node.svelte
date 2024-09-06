<script lang="ts">
	import Pod from '$src/lib/components/kubernetes/pod.svelte';

	export let nodeName;
	export let nodeContent;

	$: pods = Object.entries(nodeContent);
</script>

<div>
	<h3>{nodeName}</h3>
	{#each pods as [podName, podContent]}
		<Pod {podName} {podContent} />
	{/each}
</div>
