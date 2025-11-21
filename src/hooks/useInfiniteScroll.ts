import { useEffect } from "react";

export default function useInfiniteScroll(callback: () => void) {
	useEffect(() => {
		const target = document.getElementById("infinite-trigger");
		if (!target) return;

		const observer = new IntersectionObserver(
			(entries) => {
				if (entries[0].isIntersecting) {
					callback();
				}
			},
			{ threshold: 1 }
		);

		observer.observe(target);

		return () => observer.disconnect();
	}, [callback]);
}
