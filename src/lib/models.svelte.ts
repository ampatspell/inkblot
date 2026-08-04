import { loadImage } from '$lib/canvas';
import { urlFor } from '$lib/scans';

export const useCanvas = (opts: {
	size: {
		width: () => number | undefined;
		height: () => number | undefined;
	};
}) => {
	class CanvasModel {
		size = $derived.by(() => {
			return {
				width: opts.size.width(),
				height: opts.size.height()
			};
		});
		element = $state<HTMLCanvasElement>();
		ctx = $derived(this.element?.getContext('2d'));

		clear() {
			const {
				ctx,
				size: { width, height }
			} = this;
			if (ctx && width && height) {
				ctx.clearRect(0, 0, width, height);
			}
		}
	}

	return new CanvasModel();
};

export type UsedCanvas = ReturnType<typeof useCanvas>;

export const useScan = (opts: { name: () => string | undefined }) => {
	class ScanModel {
		name = $state<string>();
		img = $state<HTMLImageElement>();
	}

	const model = new ScanModel();

	const load = async (name: string) => {
		const img = await loadImage(urlFor(name));
		if (name === model.name) {
			model.img = img;
		}
	};

	$effect(() => {
		const name = opts.name();
		if (name && model.name !== name) {
			model.img = undefined;
			model.name = name;
			load(name);
		}
	});

	return model;
};
