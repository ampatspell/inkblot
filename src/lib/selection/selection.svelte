<script lang="ts">
	import { getImages } from '$lib/models.svelte';
	import Blank from './blank.svelte';
	import Content from './content.svelte';

	const images = getImages();
</script>

<div class="selection">
	{#if images.isEmpty}
		<Blank />
	{:else}
		<Content />
	{/if}
</div>

<style lang="scss">
	.selection {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
