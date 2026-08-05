import { loadImage } from '$lib/canvas';
import { urlFor } from '$lib/scans';
import { nextObject } from './utils';

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

type Position = 'left' | 'right';

export const useProcessed = (opts: {
	scan: UsedScan;
	size: () => Size | undefined;
	position: Position;
	tools: UsedTools;
}) => {
	const size = $derived(opts.size());

	const processed = document.createElement('canvas');

	$effect(() => {
		const ctx = processed.getContext('2d');
		if (ctx && size) {
			// needs flips, rotation
			processed.width = size.width;
			processed.height = size.height;
			const img = opts.scan.img;
			if (img) {
				ctx.drawImage(img, 0, 0, size.width, size.height);
			} else {
				ctx.clearRect(0, 0, size.width, size.height);
			}
		}
	});

	class ProcessedModel {
		draw(canvas: UsedCanvas) {
			const ctx = canvas.ctx;
			if (ctx && size) {
				const { width, height } = size;

				if (opts.tools.hFlip.value) {
					if (opts.position !== 'left') {
						ctx.translate(width, 0);
						ctx.scale(-1, 1);
					}
				} else {
					if (opts.position === 'left') {
						ctx.translate(width, 0);
						ctx.scale(-1, 1);
					}
				}

				if (opts.tools.vFlip.value) {
					ctx.translate(0, height);
					ctx.scale(1, -1);
				}

				ctx.drawImage(processed, 0, 0, width, height);
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

export const useBooleanProp = () => {
	class BooleanProp {
		value = $state(false);
		onToggle = () => {
			this.value = !this.value;
		};
	}
	return new BooleanProp();
};

export type UsedBooleanProp = ReturnType<typeof useBooleanProp>;

export const useRotationProp = () => {
	class RotationProp {
		value = $state(0);
		onNext = () => {
			this.value = this.value + 90;
			if (this.value > 270) {
				this.value = 0;
			}
		};
	}
	return new RotationProp();
};

export type UsedRotationProp = ReturnType<typeof useRotationProp>;

export const useTools = () => {
	class ToolsModel {
		hFlip = useBooleanProp();
		vFlip = useBooleanProp();
		rotate = useRotationProp();
		options = $derived.by(() => {
			const values: [boolean, boolean, number, boolean][] = [];
			[false, true].forEach((hf) => {
				[false, true].forEach((vf) => {
					[0, 90, 180, 270].forEach((r) => {
						const current =
							hf === this.hFlip.value && vf === this.vFlip.value && this.rotate.value === r;
						values.push([hf, vf, r, current]);
					});
				});
			});
			const curr = values.find((o) => o[3] === true);
			const next = nextObject(values, curr);
			const isEnabled = !!next;
			const onNext = () => {
				if (next) {
					this.hFlip.value = next[0];
					this.vFlip.value = next[1];
					this.rotate.value = next[2];
				}
			};
			return {
				values,
				isEnabled,
				onNext
			};
		});

		reset() {
			this.hFlip.value = false;
			this.vFlip.value = false;
			this.rotate.value = 0;
		}
	}

	return new ToolsModel();
};

export type UsedTools = ReturnType<typeof useTools>;

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

	const tools = useTools();

	const left = useProcessed({ position: 'left', scan, size: () => size, tools });
	const right = useProcessed({ position: 'right', scan, size: () => size, tools });
	const canvas = useCanvas({ size: opts.size });

	class EditorModel {
		scan = scan;
		canvas = canvas;
		tools = tools;
	}

	const draw = (ctx: CanvasRenderingContext2D, size: Size) => {
		const { width, height } = canvas.size;
		if (width && height) {
			ctx.save();
			ctx.translate(Math.floor(width / 2 - size.width), Math.floor(height / 2 - size.height / 2));
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
