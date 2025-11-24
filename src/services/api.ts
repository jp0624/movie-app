// src/services/api.ts
import type { Movie, MovieRecommendationsResponse } from "../types/Movie";
import type {
	TvShow,
	Season,
	Episode,
	TvRecommendationsResponse,
} from "../types/Tv";
import type { Person, CombinedCredits } from "../types/Person";
import type {
	CreditsResponse,
	VideosResponse,
	ReviewsResponse,
	WatchProvidersResponse,
	ImagesResponse, // ✅ NEW
} from "../types/Shared";

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;

// TMDB v4 AUTH token (Bearer)
const AUTH_TOKEN = import.meta.env.VITE_TMDB_KEY;

if (!AUTH_TOKEN) {
	console.warn("[TMDB] Missing VITE_TMDB_KEY — add TMDB v4 token to .env");
}

const defaultOptions: RequestInit = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${AUTH_TOKEN}`,
	},
};

function buildUrl(
	path: string,
	params?: Record<string, string | number | undefined>
): string {
	const url = new URL(BASE_URL + path);
	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== null) {
				url.searchParams.set(key, String(value));
			}
		}
	}
	return url.toString();
}

async function fetchJson<T>(
	path: string,
	params?: Record<string, string | number | undefined>
): Promise<T> {
	const url = buildUrl(path, params);
	const res = await fetch(url, defaultOptions);
	if (!res.ok) {
		throw new Error(`TMDB API error: ${res.status} ${res.statusText}`);
	}
	return res.json() as Promise<T>;
}

// Generic paged response
interface PagedResponse<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
}

/* ---------------------------------------------
   MOVIE — LISTS
--------------------------------------------- */

export const getPopular = (page = 1) =>
	fetchJson<PagedResponse<Movie>>("/movie/popular", { page });

export const getTopRated = (page = 1) =>
	fetchJson<PagedResponse<Movie>>("/movie/top_rated", { page });

export const getTrending = (page = 1) =>
	fetchJson<PagedResponse<Movie>>("/trending/movie/week", { page });

export const getNowPlaying = (page = 1) =>
	fetchJson<PagedResponse<Movie>>("/movie/now_playing", { page });

export const searchMovies = (query: string, page = 1) =>
	fetchJson<PagedResponse<Movie>>("/search/movie", { query, page });

/* ---------------------------------------------
   MOVIE — DETAILS
--------------------------------------------- */

export const getMovie = (id: number) => fetchJson<Movie>(`/movie/${id}`);

export const getMovieCredits = (id: number) =>
	fetchJson<CreditsResponse>(`/movie/${id}/credits`);

export const getMovieVideos = (id: number) =>
	fetchJson<VideosResponse>(`/movie/${id}/videos`);

export const getMovieReviews = (id: number) =>
	fetchJson<ReviewsResponse>(`/movie/${id}/reviews`);

export const getMovieRecommendations = (id: number) =>
	fetchJson<MovieRecommendationsResponse>(`/movie/${id}/recommendations`);

export const getMovieWatchProviders = (id: number) =>
	fetchJson<WatchProvidersResponse>(`/movie/${id}/watch/providers`);

export const getMovieImages = (id: number) =>
	fetchJson<ImagesResponse>(`/movie/${id}/images`);

/* ---------------------------------------------
   TV — LISTS
--------------------------------------------- */

export const getPopularTv = (page = 1) =>
	fetchJson<PagedResponse<TvShow>>("/tv/popular", { page });

export const getTopRatedTv = (page = 1) =>
	fetchJson<PagedResponse<TvShow>>("/tv/top_rated", { page });

export const getTrendingTv = (page = 1) =>
	fetchJson<PagedResponse<TvShow>>("/trending/tv/week", { page });

export const getOnTheAirTv = (page = 1) =>
	fetchJson<PagedResponse<TvShow>>("/tv/on_the_air", { page });

export const searchTv = (query: string, page = 1) =>
	fetchJson<PagedResponse<TvShow>>("/search/tv", { query, page });

/* ---------------------------------------------
   TV — DETAILS
--------------------------------------------- */

export const getTv = (id: number) => fetchJson<TvShow>(`/tv/${id}`);

export const getTvCredits = (id: number) =>
	fetchJson<CreditsResponse>(`/tv/${id}/credits`);

export const getTvVideos = (id: number) =>
	fetchJson<VideosResponse>(`/tv/${id}/videos`);

export const getTvReviews = (id: number) =>
	fetchJson<ReviewsResponse>(`/tv/${id}/reviews`);

export const getTvRecommendations = (id: number) =>
	fetchJson<TvRecommendationsResponse>(`/tv/${id}/recommendations`);

export const getTvWatchProviders = (id: number) =>
	fetchJson<WatchProvidersResponse>(`/tv/${id}/watch/providers`);

export const getTvImages = (id: number) =>
	fetchJson<ImagesResponse>(`/tv/${id}/images`);

/* ---------------------------------------------
   TV — SEASONS / EPISODES
--------------------------------------------- */

export const getTvSeason = (id: number, season: number) =>
	fetchJson<Season>(`/tv/${id}/season/${season}`);

export const getTvEpisode = (id: number, season: number, episode: number) =>
	fetchJson<Episode>(`/tv/${id}/season/${season}/episode/${episode}`);

export const getTvEpisodeVideos = (
	id: number,
	season: number,
	episode: number
) =>
	fetchJson<VideosResponse>(
		`/tv/${id}/season/${season}/episode/${episode}/videos`
	);

export const getTvSeasonImages = (id: number, season: number) =>
	fetchJson<ImagesResponse>(`/tv/${id}/season/${season}/images`);

export const getTvEpisodeImages = (
	id: number,
	season: number,
	episode: number
) =>
	fetchJson<ImagesResponse>(
		`/tv/${id}/season/${season}/episode/${episode}/images`
	);

/* ---------------------------------------------
   PERSON
--------------------------------------------- */

export const getPerson = (id: number) => fetchJson<Person>(`/person/${id}`);

export const getPersonCombinedCredits = (id: number) =>
	fetchJson<CombinedCredits>(`/person/${id}/combined_credits`);

export const getPersonImages = (id: number) =>
	fetchJson<ImagesResponse>(`/person/${id}/images`);

/* ---------------------------------------------
   MULTI SEARCH
--------------------------------------------- */

export const searchMulti = (query: string, page = 1) =>
	fetchJson<PagedResponse<any>>("/search/multi", { query, page });

/* ---------------------------------------------
   TRENDING ALL (for Hero)
--------------------------------------------- */

export const getTrendingAll = (page = 1) =>
	fetchJson<PagedResponse<Movie | TvShow>>("/trending/all/week", { page });
