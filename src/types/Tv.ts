// src/types/Tv.ts
import type { Genre, RecommendationsResponse } from "./Shared";

/* ----------------------------------------
 * SEASONS & EPISODES
 * ------------------------------------- */

export interface Episode {
	id: number;
	name: string;
	overview: string;
	still_path: string | null;
	air_date?: string;
	episode_number: number;
	season_number: number;
	vote_average?: number;
	runtime?: number;
}

export interface Season {
	id: number;
	name: string;
	overview: string;
	poster_path: string | null;
	air_date?: string;
	season_number: number;
	episode_count?: number;
	episodes?: Episode[];
}

/* ----------------------------------------
 * TV SHOW
 * ------------------------------------- */

export interface TvShow {
	id: number;
	name: string;
	overview: string;
	poster_path: string | null;
	backdrop_path?: string | null;
	first_air_date?: string;
	last_air_date?: string;
	vote_average: number;
	number_of_seasons?: number;
	number_of_episodes?: number;
	status?: string;
	tagline?: string;
	genres?: Genre[];
	homepage?: string | null;
	popularity?: number;
	media_type?: "tv";
	seasons?: Season[];
}

/**
 * TV-specific recommendations payload.
 */
export type TvRecommendationsResponse = RecommendationsResponse<TvShow>;
