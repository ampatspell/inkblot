<script lang="ts">
	import { resolve } from '$app/paths';
	import { names } from '$lib/scans';
	import { nextObject, prevObject } from '$lib/utils';

	let { name }: { name: string } = $props();

	let next = $derived(nextObject(names, name, false));
	let prev = $derived(prevObject(names, name, false));
</script>

{#snippet link(name: string | undefined, label: string)}
	{@const href = name ? resolve('/scans/[name]', { name }) : undefined}
	<a class={{ has: !!href }} {href}>{label}</a>
{/snippet}

<div class="navigation">
	{@render link(prev, '←')}
	{@render link(next, '→')}
</div>

<style lang="scss">
	.navigation {
		padding: 5px;
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		> a {
			line-height: 1;
			padding: 5px 10px;
			border-radius: 3px;
			text-decoration: none;
			&:not(.has) {
				opacity: 0.3;
			}
			&.has {
				&:hover {
					background: var(--dark-selected-background-color-2);
				}
			}
		}
	}
</style>
