<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import { getImages } from '$lib/models.svelte';

	let images = getImages();

	let name = images.firstHandleName;
	if (name) {
		goto(resolve('/scans/[name]', { name }));
	} else {
		goto(resolve('/'));
	}
</script>
