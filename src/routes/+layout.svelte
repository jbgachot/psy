<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import '../app.css';

	const { children } = $props();
</script>

<div class="h-screen flex flex-col">
	<Header />
	<div class="flex-1 relative overflow-hidden">
		{@render children()}
	</div>
</div>
