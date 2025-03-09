<script>
	import { page } from '$app/stores';
	import logo from '$lib/images/psy.svg';

	const navUlLiClasses = 'rounded-md px-3 py-2 mx-2 hover:bg-indigo-900';
</script>

<header class="flex justify-between bg-indigo-950 py-2">
	<div class="w-12">
		<a class="flex items-center justify-center w-full h-full" href="/">
			<img class="w-8 object-contain" src={logo} alt="PSY" />
		</a>
	</div>

	<nav class="flex justify-center">
		<ul class="flex relative justify-center items-center h-12 list-none">
			<li class={navUlLiClasses} class:bg-indigo-700={$page.url.pathname === '/'}>
				<a href="/">Home</a>
			</li>
		</ul>
	</nav>

	<div class="w-12">
		<a class="flex items-center justify-center w-full h-full" href="/">
			<img class="w-8 object-contain" src={logo} alt="PSY" />
		</a>
	</div>
</header>
