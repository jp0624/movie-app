import { useEffect, useState } from "react";
import type { Movie } from "../types/Movie";
import { useMovie } from "../contexts/MovieContext";
import { getMovie } from "../services/api";
import MovieCard from "../components/MovieCard";

export default function Favorites() {
	const { favorites, ratings } = useMovie();
	const [movies, setMovies] = useState<Movie[]>([]);

	useEffect(() => {
		const load = async () => {
			if (favorites.length === 0) {
				setMovies([]);
				return;
			}
			const data = await Promise.all(favorites.map((id) => getMovie(id)));
			setMovies(data);
		};

		load();
	}, [favorites]);

	const sorted = [...movies].sort((a, b) => {
		const ra = ratings[a.id] ?? 0;
		const rb = ratings[b.id] ?? 0;
		return rb - ra;
	});

	return (
		<div className="p-6">
			{sorted.length === 0 ? (
				<p className="text-center text-gray-600 dark:text-gray-400">
					No favorites yet.
				</p>
			) : (
				<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
					{sorted.map((m) => (
						<MovieCard key={m.id} movie={m} />
					))}
				</div>
			)}
		</div>
	);
}
