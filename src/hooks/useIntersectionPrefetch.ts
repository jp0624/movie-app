// src/hooks/useIntersectionPrefetch.ts
import { useEffect, useRef } from "react";

export function useIntersectionPrefetch(callback: () => void) {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) callback();
			},
			{ rootMargin: "400px", threshold: 0.01 }
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [callback]);

	return ref;
}
