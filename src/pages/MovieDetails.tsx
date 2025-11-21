import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovie } from "../services/api";
import type { Movie } from "../types/Movie";

export default function MovieDetails() {
	const { id } = useParams();
	const [movie, setMovie] = useState<Movie | null>(null);

	useEffect(() => {
		const load = async () => {
			const data = await getMovie(Number(id));
			setMovie(data);
		};
		load();
	}, [id]);

	if (!movie)
		return <p className="text-center text-gray-400 mt-12">Loading…</p>;

	return (
		<div className="max-w-5xl mx-auto p-6 text-white">
			<div className="grid md:grid-cols-2 gap-8">
				<img
					className="rounded shadow-lg"
					src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
				/>

				<div>
					<h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
					<p className="text-gray-300 mb-4">{movie.overview}</p>
					<p className="text-gray-400">
						⭐ TMDB Score: {movie.vote_average}/10
					</p>
					{movie.runtime && (
						<p className="text-gray-400">🕒 Runtime: {movie.runtime} min</p>
					)}
				</div>
			</div>
		</div>
	);
}
