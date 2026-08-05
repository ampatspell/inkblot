<script lang="ts">
	import Button from '$lib/button.svelte';
	import { getImages } from '$lib/models.svelte';

	const images = getImages();

	const onClick = () => {
		images.select();
	};
</script>

<div class="blank">
	<div class="blot">
		<!-- svelte-ignore a11y_missing_attribute -->
		<img src="/blot.png" draggable="false" />
	</div>
	<div class="action">
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
		overflow: hidden;
		> .blot {
			padding: 0 0 0 40px;
		}
		> .action {
			padding: 50px 0 0 0;
		}
	}
</style>
