<script lang="ts">
	export let containerName;
	export let containerContent;

	import { containerInfo } from '$src/lib/stores/container';
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	on:mouseenter={() =>
		containerInfo.set({
			name: containerName,
			status: 'Created',
			startDate: '2024-09-16 23h30',
			visible: true
		})}
	on:mouseleave={() => containerInfo.clear()}
	class="relative"
	style="width: {containerContent.size}%;"
>
	<div class="h-full absolute right-1 bottom-0">
		<div
			class="h-5/6 whitespace-nowrap overflow-hidden text-ellipsis text-center text-xxs vertical-label text-indigo-400"
		>
			{containerName}
		</div>
	</div>
	<span
		class="block p-1 border-indigo-400 border-4 bg-indigo-900 text-xs h-20"
		style="font-size: 0.5rem"
	></span>
</div>
