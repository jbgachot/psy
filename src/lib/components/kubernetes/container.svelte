<script lang="ts">
	export let containerName;
	export let containerContent;
</script>

<div>
	<h3>{containerName}</h3>
	<p>cpu limit : {containerContent.cpu.limit}</p>
	<p>cpu request : {containerContent.cpu.request}</p>
</div>
