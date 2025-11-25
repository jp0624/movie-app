// src/pages/Favorites.tsx
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

import { useMovie } from "../contexts/MovieContext";
import type { Movie } from "../types/Movie";
import { getMovie } from "../services/api";

import Surface from "../components/ui/Surface";
import SectionHeader from "../components/ui/SectionHeader";
import MovieGrid from "../components/media/lists/MovieGrid";
import MovieSkeleton from "../components/media/MovieSkeleton";

export default function Favorites() {
	const { favorites, ratings } = useMovie(); // favorites: number[], ratings: Record<number, number>
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const load = async () => {
			if (!favorites || favorites.length === 0) {
				setMovies([]);
				setError(null);
				setLoading(false);
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const results = await Promise.all(
					favorites.map(async (id) => {
						try {
							// Safely handle 404 / missing movies
							const movie = await getMovie(id);
							return movie;
						} catch (err) {
							console.warn("[Favorites] Failed to fetch movie", id, err);
							return null;
						}
					})
				);

				const validMovies = results.filter((m): m is Movie => m !== null);

				setMovies(validMovies);
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to load favorites."
				);
			} finally {
				setLoading(false);
			}
		};

		void load();
	}, [favorites]);

	const sortedMovies = useMemo(() => {
		if (!movies.length) return [];
		// Sort by local rating (desc), then TMDB vote_average (desc)
		return [...movies].sort((a, b) => {
			const ratingA = ratings[a.id] ?? 0;
			const ratingB = ratings[b.id] ?? 0;
			if (ratingA !== ratingB) return ratingB - ratingA;
			return (b.vote_average ?? 0) - (a.vote_average ?? 0);
		});
	}, [movies, ratings]);

	return (
		<motion.main
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-background pt-5 pb-10"
		>
			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<Surface>
					<SectionHeader title="Favorites" eyebrow="My List" />
					{loading && (
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							{Array.from({ length: 8 }).map((_, i) => (
								<MovieSkeleton key={i} />
							))}
						</div>
					)}

					{!loading && error && (
						<p className="mt-4 text-sm text-red-400">
							Failed to load favorites: {error}
						</p>
					)}

					{!loading && !error && sortedMovies.length === 0 && (
						<p className="mt-4 text-sm text-muted">
							You haven&apos;t added any favorites yet.
						</p>
					)}

					{!loading && !error && sortedMovies.length > 0 && (
						<div className="mt-4">
							<MovieGrid movies={sortedMovies} />
						</div>
					)}
				</Surface>
			</section>
		</motion.main>
	);
}
