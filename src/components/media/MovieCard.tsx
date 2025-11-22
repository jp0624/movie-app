// src/components/media/MovieCard.tsx
import { Link } from "react-router-dom";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useMovie } from "../../contexts/MovieContext";
import { useState } from "react";
import type { Movie } from "../../types/Movie";

interface Props {
	movie: Movie;
	mediaType?: "movie" | "tv";
}

export default function MovieCard({ movie, mediaType = "movie" }: Props) {
	const { favorites, toggleFavorite } = useMovie();
	const isFav = favorites.includes(movie.id);
	const [loaded, setLoaded] = useState(false);

	// === Motion values for 3D tilt ===
	const x = useMotionValue(0);
	const y = useMotionValue(0);

	const rotateX = useTransform(y, [-50, 50], [8, -8]);
	const rotateY = useTransform(x, [-50, 50], [-8, 8]);

	const title = movie.title ?? movie.name ?? "Untitled";
	const year =
		(movie.release_date ?? movie.first_air_date ?? "").split("-")[0] ?? "";
	const detailPath =
		mediaType === "movie" ? `/movie/${movie.id}` : `/tv/${movie.id}`;

	// === Initial Fade-in Animation ===
	const fadeIn = {
		hidden: { opacity: 0, y: 25 },
		show: {
			opacity: 1,
			y: 0,
			transition: { duration: 0.45, ease: "easeOut" },
		},
	};

	return (
		<motion.div
			variants={fadeIn}
			initial="hidden"
			whileInView="show"
			viewport={{ once: true, amount: 0.2 }}
			style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
			className="
				group relative overflow-hidden rounded-xl border border-zinc-800/70 
				bg-zinc-900 shadow-lg shadow-black/40 transition-all
				will-change-transform will-change-opacity
				hover:shadow-red-600/30 hover:shadow-2xl
			"
			onMouseMove={(e) => {
				const rect = e.currentTarget.getBoundingClientRect();
				x.set(e.clientX - rect.left - rect.width / 2);
				y.set(e.clientY - rect.top - rect.height / 2);
			}}
			onMouseLeave={() => {
				x.set(0);
				y.set(0);
			}}
		>
			<Link to={detailPath}>
				<div className="relative aspect-[2/3] overflow-hidden">
					{/* Blur-up placeholder */}
					<img
						src={
							movie.poster_path
								? `https://image.tmdb.org/t/p/w92${movie.poster_path}`
								: "/no-image.png"
						}
						className={`absolute inset-0 h-full w-full object-cover blur-xl scale-110 transition-opacity duration-500 ${
							loaded ? "opacity-0" : "opacity-100"
						}`}
						aria-hidden
					/>

					{/* Main HD image */}
					<motion.img
						src={
							movie.poster_path
								? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
								: "/no-image.png"
						}
						onLoad={() => setLoaded(true)}
						alt={title}
						className={`
							h-full w-full object-cover 
							transition-all duration-[900ms] ease-out
							${loaded ? "opacity-100 scale-100" : "opacity-0 scale-95"}
							group-hover:scale-[1.12]
						`}
						style={{ translateZ: 20 }} // Parallax depth layer
					/>

					{/* Tilt-shift blur overlay */}
					<div
						className="
							pointer-events-none absolute inset-0 
							bg-gradient-to-t from-black/50 via-black/20 to-transparent 
							opacity-0 group-hover:opacity-100 transition-opacity duration-500
							backdrop-blur-[1px]
						"
						style={{ translateZ: 30 }}
					/>

					{/* Light ray sweep */}
					<motion.div
						initial={{ x: "-120%" }}
						whileHover={{ x: "220%" }}
						transition={{ duration: 1.2, ease: "easeInOut" }}
						className="
							pointer-events-none absolute inset-y-0 w-1/3 
							bg-gradient-to-r from-transparent via-white/15 to-transparent 
							skew-x-12
						"
						style={{ translateZ: 40 }}
					/>

					{/* Floating reflection */}
					<div
						className="
							absolute top-0 left-0 w-full h-1/3 
							bg-gradient-to-b from-white/30 to-transparent 
							opacity-0 group-hover:opacity-40 transition-opacity duration-700
						"
						style={{ translateZ: 35 }}
					/>
				</div>
			</Link>

			{/* CONTENT */}
			<div className="p-4 text-zinc-100 space-y-2">
				<div className="flex justify-between items-start">
					<div>
						<h3 className="font-semibold text-sm md:text-base line-clamp-2">
							{title}
						</h3>
						{year && <p className="text-xs text-zinc-400">{year}</p>}
					</div>

					<button
						onClick={() => toggleFavorite(movie.id)}
						className={`
							text-xl transition-transform 
							${isFav ? "text-red-500 scale-110" : "text-zinc-400 hover:text-red-400"}
						`}
					>
						♥
					</button>
				</div>

				{/* Rating */}
				<div className="text-xs text-zinc-300 flex items-center gap-1">
					<span className="text-yellow-400 text-base">★</span>
					{movie.vote_average.toFixed(1)}
				</div>
			</div>
		</motion.div>
	);
}
