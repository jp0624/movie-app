// src/hooks/useInfiniteScroll.ts
import { useEffect } from "react";

export default function useInfiniteScroll(callback: () => void) {
	useEffect(() => {
		const target = document.getElementById("infinite-trigger");
		if (!target) return;

		let ticking = false;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting && !ticking) {
					ticking = true;
					callback();
					// small delay to avoid rapid-fire triggers while layout settles
					setTimeout(() => {
						ticking = false;
					}, 400);
				}
			},
			{
				root: null,
				rootMargin: "200px 0px 0px 0px",
				threshold: 0.1,
			}
		);

		observer.observe(target);

		return () => observer.disconnect();
	}, [callback]);
}
