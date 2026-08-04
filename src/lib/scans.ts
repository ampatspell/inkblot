import { run } from './utils';

export const names = run(() => {
	const arr: string[] = [];
	for (let i = 3; i <= 24; i++) {
		arr.push(`${i}`.padStart(3, '0'));
	}
	return arr;
});

export const urlFor = (name: string) => {
	return `/scans/scan-${name}.jpg`;
};
