<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { setImagesContext, useImages } from '$lib/models.svelte';
	import '../lib/reset.scss';
	import '../lib/style.scss';

	let { children } = $props();

	setImagesContext(
		useImages({
			didFailToLoadImage: () => goto(resolve('/'))
		})
	);
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:wght@400;700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}
