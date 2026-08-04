<script lang="ts">
	import Canvas from '$lib/canvas.svelte';
	import type { UsedEditor } from '$lib/models.svelte';

	let props: { editor: UsedEditor } = $props();
	let canvas = $derived(props.editor.canvas);
</script>

<div class="editor">
	<Canvas {canvas} />
</div>

<style lang="scss">
	.editor {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}
</style>
