<script module>
	import type { ResolvedPathname } from '$app/types';
	import type { Snippet } from 'svelte';

	export type ButtonProps = (
		| {
				type: 'action';
				onClick?: () => void;
		  }
		| { type: 'route'; route?: ResolvedPathname }
	) & {
		isDisabled?: boolean;
		variant?: 'regular' | 'fill';
	} & (
			| {
					value: string;
			  }
			| {
					children: Snippet;
			  }
		);
</script>

<script lang="ts">
	// eslint-disable-next-line svelte/no-unused-props
	let props: ButtonProps = $props();

	let isDisabled = $derived(props.isDisabled ?? false);
</script>

{#snippet content()}
	{#if 'value' in props}
		{props.value}
	{:else if 'children' in props}
		{@render props.children()}
	{/if}
{/snippet}

{const cls = {
	button: true,
	[`variant-${props.variant ?? 'regular'}`]: true
}}

{#if props.type === 'action'}
	<button
		class={{ ...cls, disabled: isDisabled || !props.onClick }}
		onclick={() => props.onClick?.()}>{@render content()}</button
	>
{:else if props.type === 'route'}
	<a class={{ ...cls, disabled: isDisabled || !props.route }} href={props.route}
		>{@render content()}</a
	>
{/if}

<style lang="scss">
	.button {
		appearance: none;
		outline: none;
		border: none;
		background: var(--dark-color);
		color: var(--dark-white-color);
		font-family: var(--dark-font-family);
		font-size: var(--dark-font-size);
		width: 100%;
		font-weight: 600;
		line-height: 14px;
		padding: 5px 8px;
		border-radius: 3px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;
		white-space: nowrap;
		gap: 8px;
		transition: 0.15s ease-in-out opacity;
		text-decoration: none;
		&.variant-regular {
			max-width: max-content;
		}
		&.variant-fill {
			width: 100%;
		}
		&.disabled {
			opacity: 0.25;
			pointer-events: none;
		}
	}
</style>
