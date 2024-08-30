<script lang="ts">
	import Header from '$lib/components/header.svelte';
	import '../app.css';

	const { children } = $props();
</script>

<Header />

<div class="p-5">
	{@render children()}
</div>
