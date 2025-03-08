<script lang="ts">
	import { containerInfo } from '$src/lib/stores/container';
	import {
		IconCalendarTime,
		IconCpu,
		IconSquareRoundedLetterL,
		IconSquareRoundedLetterR,
		IconStatusChange,
		IconTag
	} from '@tabler/icons-svelte';

	const formatCPU = (cpu: number) => (cpu >= 1 ? `${cpu}G` : `${cpu * 1000}M`);
</script>

{#if $containerInfo}
	<div
		class="min-w-100 left-auto top-auto right-0 bottom-0 absolute z-50 p-2 bg-indigo-600 text-white opacity-45"
		class:hidden={!$containerInfo.visible}
	>
		<ul>
			<li>{$containerInfo.name}</li>
			<li>
				<IconStatusChange class="inline-block align-middle w-5 h-5" />
				<span class="inline-block align-middle">{$containerInfo.status}</span>
			</li>
			<li>
				<IconCalendarTime class="inline-block align-middle w-5 h-5" />
				<span class="inline-block align-middle"
					>{new Date($containerInfo.startDate).toLocaleString()}</span
				>
			</li>
			{#if $containerInfo.labels}
				<li class="flex mt-1.5">
					<IconTag class="inline-block align-middle w-5 h-5" />
					<ul class="ml-2 -mt-0.5">
						{#each Object.entries($containerInfo.labels) as [key, value]}
							<li>{key}:{value}</li>
						{/each}
					</ul>
				</li>
			{/if}
			{#if $containerInfo.cpu}
				<li>
					<IconCpu class="inline-block align-middle w-5 h-5" />
					<IconSquareRoundedLetterR class="inline-block align-middle w-5 h-5" />
					<span class="inline-block align-middle">{formatCPU($containerInfo.cpu.request)}</span>
					<IconSquareRoundedLetterL class="inline-block align-middle w-5 h-5" />
					<span class="inline-block align-middle">{formatCPU($containerInfo.cpu.limit)}</span>
				</li>
			{/if}
		</ul>
	</div>
{/if}
