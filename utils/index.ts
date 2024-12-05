export const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substring(2);
export const loadAudio = (audioFile: string): HTMLAudioElement => new Audio(audioFile);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const throttle = <T extends (...args: any[]) => any>(
	func: T,
	limit: number,
): ((...args: Parameters<T>) => void) => {
	let lastFunc: ReturnType<typeof setTimeout>;
	let lastRan: number;

	return (...args: Parameters<T>) => {
		if (!lastRan) {
			func.apply(this, args);
			lastRan = Date.now();
		} else {
			clearTimeout(lastFunc);
			lastFunc = setTimeout(
				() => {
					if (Date.now() - lastRan >= limit) {
						func.apply(this, args);
						lastRan = Date.now();
					}
				},
				limit - (Date.now() - lastRan),
			);
		}
	};
};
