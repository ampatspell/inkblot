<script lang="ts">
	import Editor from '$lib/editor/editor.svelte';
	import Navigation from '$lib/editor/navigation.svelte';
	import Tools from '$lib/editor/tools.svelte';
	import { useEditor } from '$lib/models.svelte';
	import { innerHeight, innerWidth } from 'svelte/reactivity/window';
	import type { PageProps } from './$types';

	let props: PageProps = $props();
	let name = $derived(props.params.name);
	let tools = 300;

	let editor = useEditor({
		name: () => name,
		size: {
			width: () => (innerWidth.current ?? 0) - tools - 1,
			height: () => innerHeight.current
		}
	});
</script>

<div class="page" style:--tools="{tools}px">
	<div class="editor">
		<Editor {editor} />
	</div>
	<div class="tools">
		<Tools {editor} />
		<div class="footer">
			<Navigation {name} />
		</div>
	</div>
</div>

<style lang="scss">
	.page {
		flex: 1;
		display: flex;
		flex-direction: row;
		> .editor {
			flex: 1;
			display: flex;
		}
		> .tools {
			width: var(--tools);
			display: flex;
			flex-direction: column;
			border-left: 1px solid var(--dark-border-color-1);
			> .footer {
				border-top: 1px solid var(--dark-border-color-1);
			}
		}
	}
</style>
