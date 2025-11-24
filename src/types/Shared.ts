// src/types/Shared.ts

/** Generic genre used by both movies and TV. */
export interface Genre {
	id: number;
	name: string;
}

/* ----------------------------------------
 * PEOPLE / CREDITS
 * ------------------------------------- */

export interface CastMember {
	id: number;
	name: string;
	character?: string;
	profile_path: string | null;
	order?: number;
	known_for_department?: string;
	gender?: number;
}

export interface CrewMember {
	id: number;
	name: string;
	job?: string;
	department?: string;
	profile_path: string | null;
}

export interface CreditsResponse {
	id: number;
	cast: CastMember[];
	crew: CrewMember[];
}

/* ----------------------------------------
 * VIDEOS / TRAILERS
 * ------------------------------------- */

export interface Video {
	id: string;
	key: string;
	name: string;
	site: string;
	type: string;
	official?: boolean;
	published_at?: string;
}

export interface VideosResponse {
	id: number;
	results: Video[];
}

/* ----------------------------------------
 * REVIEWS
 * ------------------------------------- */

export interface ReviewAuthorDetails {
	name: string;
	username: string;
	avatar_path: string | null;
	rating: number | null;
}

export interface Review {
	id: string;
	author: string;
	content: string;
	created_at: string;
	author_details: ReviewAuthorDetails;
	url: string;
}

export interface ReviewsResponse {
	id: number;
	page: number;
	results: Review[];
	total_pages: number;
	total_results: number;
}

/* ----------------------------------------
 * RECOMMENDATIONS (generic)
 * ------------------------------------- */

/**
 * Generic recommendations payload. Each module can
 * specialize it with its own media type.
 */
export interface RecommendationsResponse<TMedia = any> {
	page: number;
	results: TMedia[];
	total_pages: number;
	total_results: number;
}

/* ----------------------------------------
 * WATCH PROVIDERS
 * ------------------------------------- */

export interface Provider {
	display_priority: number;
	logo_path: string | null;
	provider_id: number;
	provider_name: string;
}

export interface CountryProviders {
	link: string;
	flatrate?: Provider[];
	rent?: Provider[];
	buy?: Provider[];
}

export interface WatchProvidersResponse {
	id: number;
	results: Record<string, CountryProviders>;
}

/* ----------------------------------------
 * PERSON COMBINED CREDITS ENTRIES
 * ------------------------------------- */

export interface CreditEntry {
	id: number;
	media_type: "movie" | "tv";
	title?: string;
	name?: string;
	poster_path: string | null;
	release_date?: string;
	first_air_date?: string;
	character?: string;
	episode_count?: number;
	vote_average?: number;
	popularity?: number;
}

export interface CombinedCredits {
	cast: CreditEntry[];
	crew: CreditEntry[];
}

/* ----------------------------------------
 * IMAGES
 * ------------------------------------- */

export interface ImageAsset {
	aspect_ratio: number;
	file_path: string;
	height: number;
	width: number;
	iso_639_1: string | null;
	vote_average: number;
	vote_count: number;
}

/**
 * Generic images response used for movies, TV, seasons,
 * episodes and people. Not all keys are always present.
 */
export interface ImagesResponse {
	id: number;
	backdrops?: ImageAsset[];
	posters?: ImageAsset[];
	logos?: ImageAsset[];
	stills?: ImageAsset[];
	profiles?: ImageAsset[];
}
