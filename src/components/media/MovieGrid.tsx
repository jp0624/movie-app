// src/components/media/MovieGrid.tsx
import { motion } from "framer-motion";
import type { Movie } from "../../types/Movie";
import type { TvShow } from "../../types/Tv";
import MovieCard from "./MovieCard";

type Mode = "movie" | "tv";

interface Props {
	movies: (Movie | TvShow)[];
	mediaType?: Mode;
	className?: string;
}

export default function MovieGrid({
	movies,
	mediaType = "movie",
	className = "",
}: Props) {
	return (
		<div
			className={`grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 ${className}`}
		>
			{movies.map((m, index) => (
				<motion.div
					key={m.id}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{
						duration: 0.35,
						delay: index * 0.05,
						ease: "easeOut",
					}}
				>
					<MovieCard movie={m} mediaType={mediaType} />
				</motion.div>
			))}
		</div>
	);
}
