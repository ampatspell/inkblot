<script lang="ts">
	import type { UsedCanvas } from '../routes/dev/dev.svelte';

	let props: {
		canvas: UsedCanvas;
	} = $props();

	let canvas = $state<HTMLCanvasElement>();

	$effect(() => {
		if (canvas) {
			let { width, height } = props.canvas.size;
			if (width && height) {
				canvas.width = width;
				canvas.height = height;
				canvas.style.width = `${width}px`;
				canvas.style.height = `${height}px`;
				props.canvas.element = canvas;
			}
		}

		return () => {
			props.canvas.element = undefined;
		};
	});
</script>

<canvas class="canvas" bind:this={canvas}></canvas>

<style lang="scss">
	.canvas {
		outline: none;
		border: none;
	}
</style>
