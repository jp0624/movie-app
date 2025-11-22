// src/types/Movie.ts
import type { Genre, RecommendationsResponse } from "./Shared";

/**
 * Core Movie type used across the app.
 */
export interface Movie {
	id: number;
	title?: string;
	name?: string; // Sometimes TMDB uses "name" for movie-like objects
	overview: string;
	poster_path: string | null;
	backdrop_path?: string | null;
	release_date?: string;
	first_air_date?: string;
	vote_average: number;
	runtime?: number;
	genres?: Genre[];
	tagline?: string;
	status?: string;
	homepage?: string | null;
	adult?: boolean;
	popularity?: number;
	media_type?: "movie" | "tv";
}

/**
 * Movie-specific recommendations payload.
 */
export type MovieRecommendationsResponse = RecommendationsResponse<Movie>;
