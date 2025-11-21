import { useState, useEffect } from "react";

export default function useDebounce<T>(value: T, delay = 300): T {
	const [debounced, setDebounced] = useState(value);

	useEffect(() => {
		const timeout = setTimeout(() => setDebounced(value), delay);
		return () => clearTimeout(timeout);
	}, [value]);

	return debounced;
}
