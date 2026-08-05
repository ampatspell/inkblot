<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import Button from '$lib/button.svelte';
	import { getImages } from '$lib/models.svelte';

	const images = getImages();

	const onClear = () => images.clear();
	const onStart = () => goto(resolve('/images'));
</script>

<div class="content">
	<div class="row">{images.message}</div>
	<div class="row">
		<Button type="action" onClick={onClear} value="Clear" />
		<Button type="action" onClick={onStart} value="Start" />
	</div>
</div>

<style lang="scss">
	.content {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
		> .row {
			display: flex;
			flex-direction: row;
			gap: 5px;
		}
	}
</style>
