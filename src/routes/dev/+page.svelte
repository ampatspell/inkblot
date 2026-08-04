<script lang="ts">
	import Canvas from '$lib/canvas.svelte';
	import { names } from '$lib/scans';
	import { innerHeight, innerWidth } from 'svelte/reactivity/window';
	import { useCanvas, useScan } from './dev.svelte';

	let name = names[0];

	const canvas = useCanvas({
		size: {
			width: () => innerWidth.current,
			height: () => innerHeight.current
		}
	});

	const scan = useScan({ name });

	$effect(() => {
		if (canvas.ctx && scan.img) {
			canvas.ctx.drawImage(scan.img, 0, 0, 300, 300);
		}
	});
</script>

<div class="page">
	<Canvas {canvas} />
</div>

<style lang="scss">
	.page {
	}
</style>
