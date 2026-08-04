import { loadImage } from '$lib/canvas';
import { urlFor } from '$lib/scans';

type Point = {
	x: number;
	y: number;
};

type Size = {
	width: number;
	height: number;
};

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
		size = $derived.by<Size | undefined>(() => {
			const img = this.img;
			if (img) {
				return {
					width: img.width,
					height: img.height
				};
			}
		});
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

export type UsedScan = ReturnType<typeof useScan>;

export const useProcessed = (opts: { scan: UsedScan; size: () => Size | undefined }) => {
	const size = $derived(opts.size());

	class ProcessedModel {
		draw(canvas: UsedCanvas) {
			const ctx = canvas.ctx;
			const img = opts.scan.img;
			if (ctx && img && size) {
				const { width, height } = size;
				ctx.drawImage(img, 0, 0, width, height);
			}
		}
	}

	return new ProcessedModel();
};

const contain = (size: Size, max: Size | undefined): Size | undefined => {
	if (max) {
		const scale = (key: keyof Size) => {
			return max[key] / size[key];
		};

		const s = Math.min(scale('width'), scale('height'));

		const calc = (key: keyof Size) => {
			return Math.floor(size[key] * s);
		};

		return {
			width: calc('width'),
			height: calc('height')
		};
	}
};

export const useEditor = (opts: {
	name: () => string;
	size: {
		width: () => number | undefined;
		height: () => number | undefined;
	};
}) => {
	const scan = useScan({ name: opts.name });

	const size = $derived.by(() => {
		const ew = opts.size.width();
		const eh = opts.size.height();
		const is = scan.size;
		if (ew && eh && is) {
			return contain(is, { width: ew / 2, height: eh });
		}
	});

	const left = useProcessed({ scan, size: () => size });
	const right = useProcessed({ scan, size: () => size });

	const canvas = useCanvas({ size: opts.size });

	class EditorModel {
		scan = scan;
		canvas = canvas;
	}

	const draw = (ctx: CanvasRenderingContext2D, size: Size) => {
		const height = canvas.size.height;
		if (height) {
			ctx.save();
			ctx.translate(0, Math.floor(height / 2 - size.height / 2));
			{
				ctx.save();
				left.draw(canvas);
				ctx.restore();
			}
			{
				ctx.save();
				ctx.translate(size.width, 0);
				right.draw(canvas);
				ctx.restore();
			}
			ctx.restore();
		}
	};

	$effect(() => {
		if (canvas.ctx) {
			if (scan.img && size) {
				draw(canvas.ctx, size);
			} else {
				canvas.clear();
			}
		}
	});

	return new EditorModel();
};

export type UsedEditor = ReturnType<typeof useEditor>;
