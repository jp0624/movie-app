// src/pages/Favorites.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import { useMovie } from "../contexts/MovieContext";
import { getMovie } from "../services/api";
import type { Movie } from "../types/Movie";

import MovieGrid from "../components/media/MovieGrid";
import MovieSkeleton from "../components/media/MovieSkeleton";

export default function Favorites() {
	const { favorites, ratings } = useMovie();
	const [movies, setMovies] = useState<Movie[]>([]);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const load = async () => {
			if (favorites.length === 0) {
				setMovies([]);
				return;
			}
			setLoading(true);
			try {
				const data = await Promise.all(favorites.map((id) => getMovie(id)));
				setMovies(data);
			} finally {
				setLoading(false);
			}
		};
		void load();
	}, [favorites]);

	const sorted = [...movies].sort((a, b) => {
		const ra = ratings[a.id] ?? 0;
		const rb = ratings[b.id] ?? 0;
		return rb - ra;
	});

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-background pt-20 pb-10"
		>
			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h1 className="text-2xl sm:text-3xl font-semibold text-foreground mb-4 sm:mb-6">
					Your Favorites
				</h1>

				{loading && (
					<div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
						{Array.from({ length: 10 }).map((_, i) => (
							<MovieSkeleton key={i} />
						))}
					</div>
				)}

				{!loading && sorted.length === 0 && (
					<p className="mt-8 text-center text-muted">
						No favorites yet. Start adding some movies you love!
					</p>
				)}

				{!loading && sorted.length > 0 && (
					<MovieGrid movies={sorted} className="mt-4" />
				)}
			</section>
		</motion.div>
	);
}
