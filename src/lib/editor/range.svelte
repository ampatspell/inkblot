<script lang="ts">
	import type { UsedCutProp } from '$lib/models.svelte';

	let props: { prop: UsedCutProp } = $props();
	const prop = $derived(props.prop);

	const oninput = (e: Event) => {
		let target = e.target as HTMLInputElement;
		prop.onValue(parseFloat(target.value));
	};
</script>

<input class="range" type="range" min="0" max="1" step="0.0001" value={prop.value} {oninput} />

<style lang="scss">
	.range {
		width: 100%;
	}
</style>
