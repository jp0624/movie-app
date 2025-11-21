// src/components/MovieCard.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMovie } from "../contexts/MovieContext";
import type { Movie } from "../types/Movie";

interface Props {
	movie: Movie;
	index?: number;
}

export default function MovieCard({ movie, index = 0 }: Props) {
	const { favorites, toggleFavorite, ratings, setRating } = useMovie();
	const isFav = favorites.includes(movie.id);
	const year = movie.release_date?.split("-")[0] ?? "";

	const userRating = ratings[movie.id] ?? null;

	return (
		<motion.article
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{
				duration: 0.35,
				delay: index * 0.03,
				ease: "easeOut",
			}}
			className="group bg-zinc-900/80 dark:bg-zinc-900 rounded-xl overflow-hidden shadow-lg shadow-black/40 border border-zinc-800/70 flex flex-col"
		>
			<Link
				to={`/movie/${movie.id}`}
				className="relative block overflow-hidden"
			>
				<motion.img
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.3 }}
					src={
						movie.poster_path
							? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
							: "/no-image.png"
					}
					alt={movie.title ?? movie.name ?? "Movie poster"}
					className="w-full object-cover aspect-[2/3]"
				/>

				<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 opacity-80 group-hover:opacity-100 transition-opacity" />

				<div className="absolute top-2 right-2">
					<button
						type="button"
						onClick={(e) => {
							e.preventDefault();
							toggleFavorite(movie.id);
						}}
						className={`pointer-events-auto w-9 h-9 flex items-center justify-center rounded-full border border-zinc-700/60 bg-black/60 backdrop-blur hover:scale-110 transition-transform ${
							isFav ? "text-red-400" : "text-zinc-200"
						}`}
						aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
					>
						{isFav ? "♥" : "♡"}
					</button>
				</div>
			</Link>

			<div className="p-3 flex flex-col gap-2">
				<div className="flex justify-between gap-2 items-baseline">
					<h3 className="text-sm md:text-base font-semibold text-zinc-100 line-clamp-2">
						{movie.title ?? movie.name}
					</h3>
					<span className="text-xs text-zinc-400">{year}</span>
				</div>

				<div className="flex items-center justify-between text-xs text-zinc-400">
					<span className="flex items-center gap-1">
						<span className="text-yellow-400">★</span>
						{movie.vote_average.toFixed(1)}
					</span>

					<select
						value={userRating ?? ""}
						onChange={(e) => setRating(movie.id, Number(e.target.value))}
						className="bg-zinc-800 text-zinc-100 rounded px-2 py-1 text-xs border border-zinc-700 focus:outline-none focus:ring-1 focus:ring-red-500"
					>
						<option value="">Rate</option>
						{Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
							<option key={n} value={n}>
								{n}
							</option>
						))}
					</select>
				</div>
			</div>
		</motion.article>
	);
}
