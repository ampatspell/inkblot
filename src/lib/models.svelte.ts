import { loadImage } from '$lib/canvas';
import { urlFor } from '$lib/scans';
import { untrack } from 'svelte';
import { nextObject } from './utils';

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
	fit: () => Size | undefined;
	position: Position;
	tools: UsedTools;
}) => {
	const fit = $derived(opts.fit());
	const tools = opts.tools;

	const transformed = document.createElement('canvas');
	let token = $state(0);

	$effect(() => {
		const img = opts.scan.img;
		if (fit && img) {
			const flip = opts.position === 'left';
			const deg = tools.rotate.value;

			let size: Size;
			let hf = tools.hFlip.value;
			let vf = tools.vFlip.value;
			if (deg === 90 || deg === 270) {
				size = { width: img.height, height: img.width };
				if (flip) {
					vf = !vf;
				}
			} else {
				size = { width: img.width, height: img.height };
				if (flip) {
					hf = !hf;
				}
			}

			const scaled = contain(size, fit);
			transformed.width = scaled.width;
			transformed.height = scaled.height;

			const ctx = transformed.getContext('2d');
			if (ctx) {
				ctx.translate(transformed.width / 2, transformed.height / 2);
				ctx.rotate((deg * Math.PI) / 180);
				ctx.scale(hf ? -1 : 1, vf ? -1 : 1);
				const { width, height } = contain(img, fit);
				ctx.drawImage(img, -width / 2, -height / 2, width, height);
			}
		}
		untrack(() => token++);
	});

	class ProcessedModel {
		size = $derived.by(() => {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			token;
			const { width, height } = transformed;
			return {
				width,
				height
			};
		});

		draw(canvas: UsedCanvas) {
			// eslint-disable-next-line @typescript-eslint/no-unused-expressions
			token;
			const ctx = canvas.ctx;
			if (ctx) {
				ctx.drawImage(transformed, 0, 0, transformed.width, transformed.height);
			}
		}
	}

	return new ProcessedModel();
};

const contain = (size: Size, max: Size): Size => {
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

export const useCutProp = () => {
	class CutProp {
		value = $state(0);
		onValue = (next: number) => {
			this.value = Math.min(next, 1);
		};
	}
	return new CutProp();
};

export type UsedCutProp = ReturnType<typeof useCutProp>;

export const useTools = () => {
	class ToolsModel {
		hFlip = useBooleanProp();
		vFlip = useBooleanProp();
		rotate = useRotationProp();
		cut = useCutProp();
		options = $derived.by(() => {
			const values: [boolean, boolean, number, boolean][] = [];
			[false, true].forEach((vf) => {
				[false, true].forEach((hf) => {
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
			this.cut.value = 0;
		}

		description = $derived.by(() => {
			const v = this.vFlip.value ? 'v' : '';
			const h = this.hFlip.value ? 'h' : '';
			const r = this.rotate.value ? this.rotate.value : '';
			return [v, h, r].filter(Boolean).join('');
		});
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

	const fit = $derived.by(() => {
		const width = opts.size.width();
		const height = opts.size.height();
		if (width && height) {
			return {
				width: width / 2,
				height
			};
		}
	});

	const tools = useTools();

	const left = useProcessed({ position: 'left', scan, fit: () => fit, tools });
	const right = useProcessed({ position: 'right', scan, fit: () => fit, tools });

	const canvas = useCanvas({ size: opts.size });

	const name = $derived.by(() => {
		const name = opts.name();
		const description = tools.description;
		return [name, description].filter(Boolean).join('-');
	});

	const download = () => {
		const url = canvas.element?.toDataURL('image/png');
		if (url) {
			const a = document.createElement('a');
			a.download = `${name}.png`;
			a.href = url;
			a.click();
		}
	};

	class EditorModel {
		scan = scan;
		canvas = canvas;
		tools = tools;
		download = download;
	}

	const draw = (ctx: CanvasRenderingContext2D) => {
		const { width, height } = canvas.size;
		const size = left.size;
		if (width && height) {
			const clip = Math.floor(size.width * tools.cut.value);
			ctx.clearRect(0, 0, width, height);
			{
				ctx.save();
				ctx.translate(0, Math.floor(height / 2 - size.height / 2));
				let x = Math.floor(width / 2 - size.width);
				{
					ctx.save();
					ctx.beginPath();
					ctx.rect(x + clip, 0, size.width - clip, height);
					ctx.clip();
					ctx.translate(x + clip, 0);
					left.draw(canvas);
					ctx.restore();
				}
				x += size.width - clip;
				{
					ctx.save();
					ctx.beginPath();
					ctx.rect(x + clip, 0, size.width - clip, height);
					ctx.clip();
					ctx.translate(x, 0);
					right.draw(canvas);
					ctx.restore();
				}
				ctx.restore();
			}
			{
				ctx.save();
				ctx.fillStyle = '#000';
				ctx.font = '16px Ubuntu Mono';
				ctx.fillText(tools.description, 5, 20);
				ctx.restore();
			}
		}
	};

	$effect(() => {
		if (canvas.ctx) {
			if (scan.img) {
				draw(canvas.ctx);
			} else {
				canvas.clear();
			}
		}
	});

	return new EditorModel();
};

export type UsedEditor = ReturnType<typeof useEditor>;
