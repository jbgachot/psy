<script lang="ts">
	import Pod from '$src/lib/components/kubernetes/pod.svelte';

	export let nodeName;
	export let nodeContent;

	$: pods = Object.entries(nodeContent.pods);
</script>

<div class="relative first:mt-0 mt-2" style="width: {nodeContent.size}%;">
	<div class="h-full absolute right-0 bottom-0 z-50">
		<p
			class="h-5/6 whitespace-nowrap overflow-hidden text-ellipsis text-center text-xxs vertical-label text-indigo-300"
		>
			{nodeName}
		</p>
	</div>
	<div class="flex flex-wrap p-1 bg-indigo-500">
		{#each pods as [podName, podContent]}
			<Pod {podName} {podContent} />
		{/each}
	</div>
</div>
