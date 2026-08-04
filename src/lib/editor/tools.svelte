<script lang="ts">
	import type { UsedEditor } from '$lib/models.svelte';

	let props: { editor: UsedEditor } = $props();
</script>

<div class="tools"></div>

<style lang="scss">
	.tools {
		flex: 1;
		display: flex;
		flex-direction: column;
	}
</style>
