const BASE = "https://api.themoviedb.org/3";

const options = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
	},
};

const get = async (url: string) => {
	const res = await fetch(BASE + url, options);
	if (!res.ok) throw new Error(`API error ${res.status}`);
	return res.json();
};

export const getPopular = (p = 1) => get(`/movie/popular?page=${p}`);
export const getTopRated = (p = 1) => get(`/movie/top_rated?page=${p}`);
export const getTrending = (p = 1) => get(`/trending/movie/week?page=${p}`);
export const getNowPlaying = (p = 1) => get(`/movie/now_playing?page=${p}`);

export const searchMovies = (query: string, p = 1) =>
	get(`/search/movie?query=${encodeURIComponent(query)}&page=${p}`);

export const getMovie = (id: number) => get(`/movie/${id}`);
