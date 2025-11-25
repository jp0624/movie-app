// src/hooks/useTmdbResource.ts
import { useEffect, useState } from "react";
import useTmdbCachedFetch from "./useTmdbCachedFetch";

export function useTmdbResource<T>(
	fetcher: () => Promise<T>,
	keys: any[] = []
) {
	const { get, set } = useTmdbCachedFetch<T>();

	const cacheKey = JSON.stringify(keys);

	const [data, setData] = useState<T | null>(() => get(cacheKey) ?? null);
	const [loading, setLoading] = useState(!data);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		async function load() {
			setLoading(true);
			setError(null);

			const cached = get(cacheKey);
			if (cached) {
				setData(cached);
				setLoading(false);
				return;
			}

			try {
				const result = await fetcher();
				if (!cancelled) {
					if (result) {
						set(cacheKey, result);
						setData(result);
					}
				}
			} catch (err: any) {
				if (!cancelled) setError(err?.message ?? "Failed to load");
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		load();
		return () => (cancelled = true);
	}, keys);

	return { data, loading, error };
}
