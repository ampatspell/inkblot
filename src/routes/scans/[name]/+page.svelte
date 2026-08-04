<script lang="ts">
	import { resolve } from '$app/paths';
	import Canvas from '$lib/canvas.svelte';
	import { names } from '$lib/scans';
	import { nextObject, prevObject } from '$lib/utils';
	import { innerHeight, innerWidth } from 'svelte/reactivity/window';
	import { useCanvas, useScan } from '../../../lib/models.svelte';
	import type { PageProps } from './$types';

	const props: PageProps = $props();

	let name = $derived(props.params.name);

	let scan = useScan({ name: () => name });

	let next = $derived(nextObject(names, name, false));
	let prev = $derived(prevObject(names, name, false));

	let p = 10;
	let t = 42;

	const canvas = useCanvas({
		size: {
			width: () => (innerWidth.current ?? 0) - p * 2,
			height: () => (innerHeight.current ?? 0) - t - p * 2
		}
	});

	$effect(() => {
		if (canvas.ctx) {
			if (scan.img) {
				canvas.ctx.drawImage(scan.img, 0, 0, 300, 300);
			} else {
				canvas.clear();
			}
		}
	});
</script>

<div class="page" style:--padding="{p}px" style:--tools="{t}px">
	<div class="canvas">
		<Canvas {canvas} />
	</div>
	<div class="tools">
		{#if prev}
			<a href={resolve('/scans/[name]', { name: prev })}>Prev</a>
		{/if}
		{#if next}
			<a href={resolve('/scans/[name]', { name: next })}>Next</a>
		{/if}
	</div>
</div>

<style lang="scss">
	.page {
		display: flex;
		flex-direction: column;
		> .canvas {
			padding: var(--padding);
		}
		> .tools {
			height: var(--tools);
			display: flex;
			flex-direction: row;
			gap: 10px;
			align-items: center;
			padding: 0 var(--padding);
		}
	}
</style>
