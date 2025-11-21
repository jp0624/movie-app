// src/pages/Favorites.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useMovie } from "../contexts/MovieContext";
import { getMovie } from "../services/api";
import type { Movie } from "../types/Movie";
import MovieGrid from "../components/MovieGrid";
import MovieSkeleton from "../components/MovieSkeleton";

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
			const data = await Promise.all(favorites.map((id) => getMovie(id)));
			setMovies(data);
			setLoading(false);
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
			className="px-4 py-6 bg-zinc-950 min-h-screen text-zinc-100"
		>
			<section className="max-w-4xl mx-auto">
				<h1 className="text-3xl md:text-4xl font-bold mb-4">Your Favorites</h1>

				{loading && (
					<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-4">
						{Array.from({ length: 6 }).map((_, i) => (
							<MovieSkeleton key={i} />
						))}
					</div>
				)}

				{!loading && sorted.length === 0 && (
					<p className="mt-8 text-center text-zinc-400">
						No favorites yet. Start adding some movies you love!
					</p>
				)}

				{!loading && sorted.length > 0 && <MovieGrid movies={sorted} />}
			</section>
		</motion.div>
	);
}
