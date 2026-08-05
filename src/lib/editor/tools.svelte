<script lang="ts">
	import type { UsedBooleanProp, UsedEditor, UsedRotationProp } from '$lib/models.svelte';

	let props: { editor: UsedEditor } = $props();
	let tools = $derived(props.editor.tools);
</script>

{#snippet boolean(prop: UsedBooleanProp, label: string)}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="row" onclick={() => prop.onToggle()}>
		{label}: {prop.value ? 'Yes' : 'No'}
	</div>
{/snippet}

{#snippet rotation(prop: UsedRotationProp, label: string)}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="row" onclick={() => prop.onNext()}>
		{label}: {prop.value}
	</div>
{/snippet}

{#snippet next()}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class={{ row: true, disabled: !tools.options.isEnabled }}
		onclick={() => tools.options.onNext()}
	>
		<div class="value">Next</div>
	</div>
{/snippet}

{#snippet reset()}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="row" onclick={() => tools.reset()}>Reset</div>
{/snippet}

<div class="tools">
	{@render boolean(tools.hFlip, 'Horizontal flip')}
	{@render boolean(tools.vFlip, 'Vertical flip')}
	{@render rotation(tools.rotate, 'Rotate')}
	{@render next()}
	{@render reset()}
</div>

<style lang="scss">
	.tools {
		flex: 1;
		display: flex;
		flex-direction: column;
		> .row {
			padding: 10px;
			border-bottom: 1px solid var(--dark-border-color-1);
			user-select: none;
			&.disabled {
				> .value {
					opacity: 0.3;
				}
			}
			&:not(.disabled) {
				&:hover {
					cursor: pointer;
					background: var(--dark-selected-background-color-1);
				}
			}
		}
	}
</style>
