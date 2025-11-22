// src/components/media/MovieGrid.tsx
import { motion } from "framer-motion";
import type { Movie } from "../../types/Movie";
import MovieCard from "./MovieCard";

const list = {
	hidden: {},
	show: {
		transition: { staggerChildren: 0.08 },
	},
};

export default function MovieGrid({ movies, mediaType = "movie" }) {
	return (
		<motion.div
			variants={list}
			initial="hidden"
			animate="show"
			className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6"
		>
			{movies.map((m) => (
				<MovieCard key={m.id} movie={m} mediaType={mediaType} />
			))}
		</motion.div>
	);
}
