// src/pages/MovieDetails.tsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { getMovie } from "../services/api";
import type { Movie } from "../types/Movie";
import { useMovie } from "../contexts/MovieContext";

export default function MovieDetails() {
	const { id } = useParams();
	const [movie, setMovie] = useState<Movie | null>(null);
	const [loading, setLoading] = useState(false);
	const { favorites, toggleFavorite, ratings, setRating } = useMovie();

	useEffect(() => {
		const load = async () => {
			if (!id) return;
			setLoading(true);
			const data = await getMovie(Number(id));
			setMovie(data);
			setLoading(false);
		};
		void load();
	}, [id]);

	if (loading || !movie) {
		return (
			<div className="min-h-screen bg-zinc-950 px-4 py-8 text-zinc-100">
				<p>Loading...</p>
			</div>
		);
	}

	const isFav = favorites.includes(movie.id);
	const userRating = ratings[movie.id] ?? "";

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-zinc-950 text-zinc-100"
		>
			<div className="relative h-72 md:h-80 lg:h-96 w-full overflow-hidden">
				{movie.backdrop_path && (
					<motion.img
						initial={{ scale: 1.1, opacity: 0 }}
						animate={{ scale: 1.02, opacity: 1 }}
						transition={{ duration: 0.8, ease: "easeOut" }}
						src={`https://image.tmdb.org/t/p/w1280${movie.backdrop_path}`}
						alt={movie.title ?? movie.name ?? "Backdrop"}
						className="w-full h-full object-cover"
					/>
				)}
				<div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/70 to-transparent" />
			</div>

			<section className="max-w-5xl mx-auto px-4 -mt-24 relative pb-10">
				<div className="flex flex-col md:flex-row gap-6">
					<motion.div
						initial={{ y: 40, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						className="w-40 md:w-56 shrink-0"
					>
						<img
							src={
								movie.poster_path
									? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
									: "/no-image.png"
							}
							alt={movie.title ?? movie.name ?? "Poster"}
							className="w-full rounded-xl shadow-xl border border-zinc-800/70"
						/>
					</motion.div>

					<motion.div
						initial={{ y: 40, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ delay: 0.1 }}
						className="flex-1 space-y-4"
					>
						<div className="flex flex-wrap items-center gap-3">
							<h1 className="text-3xl md:text-4xl font-bold">
								{movie.title ?? movie.name}
							</h1>
							{movie.release_date && (
								<span className="text-zinc-400">
									({movie.release_date.split("-")[0]})
								</span>
							)}
						</div>

						<div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
							<span className="flex items-center gap-1">
								<span className="text-yellow-400">★</span>
								{movie.vote_average.toFixed(1)} / 10
							</span>
							{movie.runtime && <span>{movie.runtime} min</span>}
							{movie.genres && movie.genres.length > 0 && (
								<span>{movie.genres.map((g) => g.name).join(", ")}</span>
							)}
						</div>

						<div className="flex flex-wrap gap-3 items-center">
							<button
								type="button"
								onClick={() => toggleFavorite(movie.id)}
								className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
									isFav
										? "bg-red-600 border-red-500 text-white"
										: "bg-transparent border-zinc-600 text-zinc-100 hover:bg-zinc-800"
								}`}
							>
								{isFav ? "Remove from Favorites" : "Add to Favorites"}
							</button>

							<label className="flex items-center gap-2 text-sm text-zinc-300">
								<span>Your Rating:</span>
								<select
									value={userRating}
									onChange={(e) => setRating(movie.id, Number(e.target.value))}
									className="bg-zinc-900 border border-zinc-700 rounded px-2 py-1 text-sm"
								>
									<option value="">Rate</option>
									{Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
										<option key={n} value={n}>
											{n}
										</option>
									))}
								</select>
							</label>
						</div>

						{movie.overview && (
							<div className="pt-3">
								<h2 className="font-semibold mb-1">Overview</h2>
								<p className="text-sm md:text-base text-zinc-300 leading-relaxed">
									{movie.overview}
								</p>
							</div>
						)}
					</motion.div>
				</div>
			</section>
		</motion.div>
	);
}
