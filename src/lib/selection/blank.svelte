<script lang="ts">
	import Button from '$lib/button.svelte';
	import { getImages } from '$lib/models.svelte';

	const images = getImages();

	const onClick = () => {
		images.select();
	};
</script>

<div class="blank">
	<div class="row">inkblot</div>
	<div class="row">
		<Button type="action" {onClick} value="Choose images" />
	</div>
</div>

<style lang="scss">
	.blank {
		flex: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 10px;
	}
</style>
