// src/hooks/useTmdbPreload.ts
const cache = new Map<number, Promise<any>>();
let timeout: number | undefined = undefined;

export function preload(fetcher: () => Promise<any>) {
	try {
		if (timeout) window.clearTimeout(timeout);

		timeout = window.setTimeout(() => {
			const p = fetcher();

			p.then((data: any) => {
				const id = data?.id;
				if (id && !cache.has(id)) {
					cache.set(id, Promise.resolve(data));
				}
			}).catch(() => {});
		}, 120);
	} catch {}
}

export function getPreloaded(id: number) {
	return cache.get(id);
}
