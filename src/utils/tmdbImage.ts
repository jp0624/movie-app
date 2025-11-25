// src/utils/tmdbImage.ts
const BASE = "https://image.tmdb.org/t/p";

export function tmdbPoster(path?: string, size: "sm" | "md" | "lg" = "md") {
	if (!path) return "/no-image.png";

	const map = { sm: "/w185", md: "/w342", lg: "/w500" } as const;
	return `${BASE}${map[size]}${path}`;
}

export function tmdbBackdrop(path?: string, size: "sm" | "md" | "lg" = "lg") {
	if (!path) return "/no-image.png";

	const map = { sm: "/w300", md: "/w780", lg: "/original" } as const;
	return `${BASE}${map[size]}${path}`;
}

export function tmdbStill(path?: string) {
	if (!path) return "/no-image.png";
	return `${BASE}/w300${path}`;
}
