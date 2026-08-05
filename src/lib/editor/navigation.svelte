<script lang="ts">
	import { resolve } from '$app/paths';
	import Button from '$lib/button.svelte';
	import { getImages } from '$lib/models.svelte';

	let { name }: { name: string } = $props();

	let images = getImages();
	let around = $derived(images.around(name));

	let next = $derived(around.next);
	let prev = $derived(around.prev);
</script>

{#snippet link(name: string | undefined, label: string)}
	{@const route = name ? resolve('/images/[name]', { name }) : undefined}
	<Button type="route" {route} value={label} />
{/snippet}

<div class="navigation">
	{@render link(prev, '←')}
	{@render link(next, '→')}
</div>

<style lang="scss">
	.navigation {
		padding: 5px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
	}
</style>
