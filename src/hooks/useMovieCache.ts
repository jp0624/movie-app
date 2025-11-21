export default function useMovieCache() {
	return {
		save(key: string, data: any) {
			sessionStorage.setItem(key, JSON.stringify(data));
		},
		load(key: string) {
			const item = sessionStorage.getItem(key);
			return item ? JSON.parse(item) : null;
		},
	};
}
