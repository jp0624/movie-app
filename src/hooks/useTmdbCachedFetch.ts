// src/hooks/useTmdbCachedFetch.ts
import { useRef } from "react";

export default function useTmdbCachedFetch<T>() {
	const cache = useRef<Map<string, T>>(new Map());

	function get(key: string) {
		return cache.current.get(key);
	}

	function set(key: string, value: T) {
		cache.current.set(key, value);
	}

	return { get, set };
}
