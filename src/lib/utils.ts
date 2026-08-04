export const run = <T>(cb: () => T): T => {
	return cb();
};

export type Deferred<T> = ReturnType<typeof defer<T>>;

export const defer = <T>() => {
	let resolve: (value: T | Promise<T>) => void;
	let reject: (error: unknown) => void;
	const promise = new Promise<T>((_resolve, _reject) => {
		resolve = _resolve;
		reject = _reject;
	});
	return {
		promise,
		resolve: resolve!,
		reject: reject!
	};
};

export function nextObject<T>(array: readonly T[], item: T, wrap: boolean = false) {
	const idx = array.indexOf(item);
	if (idx === -1) {
		return;
	} else if (wrap && idx === array.length - 1) {
		return array[0];
	}
	return array[idx + 1];
}

export function prevObject<T>(array: readonly T[], object: T, wrap = false) {
	const idx = array.indexOf(object);
	if (idx === -1) {
		return;
	}
	if (idx === 0) {
		if (wrap) {
			return lastObject(array);
		}
		return;
	}
	return array[idx - 1];
}

export function lastObject<T>(arr: readonly T[]) {
	return arr[arr.length - 1];
}
