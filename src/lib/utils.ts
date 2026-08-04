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
