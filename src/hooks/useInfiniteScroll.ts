import { useEffect } from "react";

export default function useInfiniteScroll(callback: () => void) {
	useEffect(() => {
		const target = document.getElementById("infinite-trigger");
		if (!target) return;

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) callback();
		});

		observer.observe(target);
		return () => observer.disconnect();
	}, []);
}
