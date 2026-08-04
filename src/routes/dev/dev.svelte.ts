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
	}

	return new CanvasModel();
};

export type UsedCanvas = ReturnType<typeof useCanvas>;

export const useScan = (opts: { name: string }) => {
	class ScanModel {
		name = $derived(opts.name);
		img = $state<HTMLImageElement>();
	}

	const model = new ScanModel();

	const load = async (name: string) => {
		const img = await loadImage(urlFor(name));
		if (name === model.name) {
			model.img = img;
		}
	};

	load(model.name);

	return model;
};
