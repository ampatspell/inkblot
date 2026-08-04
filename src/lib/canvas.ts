import { defer } from './utils';

export const loadImage = (url: string) => {
	const deferred = defer<HTMLImageElement>();
	const img = document.createElement('img');
	img.addEventListener('error', () => {
		deferred.reject(new Error('Failed to load image'));
	});
	img.addEventListener('load', () => {
		deferred.resolve(img);
	});
	img.src = url;
	return deferred.promise;
};
