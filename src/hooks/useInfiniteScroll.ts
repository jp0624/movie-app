import { useEffect } from "react";

export default function useInfiniteScroll(callback: () => void) {
	useEffect(() => {
		const target = document.getElementById("infinite-trigger");
		const obs = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) callback();
		});
		if (target) obs.observe(target);
		return () => obs.disconnect();
	}, []);
}
