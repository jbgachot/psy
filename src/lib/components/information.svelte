<script lang="ts">
	import { containerInfo } from '$src/lib/stores/container';
</script>

{#if $containerInfo}
	<div
		class="left-auto top-auto right-0 bottom-0 absolute z-50 p-2 bg-indigo-600 text-indigo-100 opacity-35"
		class:hidden={!$containerInfo.visible}
	>
		<ul>
			<li>{$containerInfo.name}</li>
			<li>Status: {$containerInfo.status}</li>
			<li>Start Time: {$containerInfo.startDate}</li>
			<li>
				Labels:
				<ul>
					<li>toto: tata</li>
					<li>tata: toto</li>
				</ul>
			</li>
			<li>
				CPU:
				<ul>
					<li>Request: containerContent.cpu.request</li>
					<li>Limit: containerContent.cpu.limit</li>
				</ul>
			</li>
		</ul>
	</div>
{/if}
