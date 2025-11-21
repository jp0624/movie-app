// src/components/MovieGrid.tsx
import { motion } from "framer-motion";
import type { Movie } from "../types/Movie";
import MovieCard from "./MovieCard";

interface Props {
	movies: Movie[];
	title?: string;
}

const containerVariants = {
	hidden: { opacity: 0 },
	show: {
		opacity: 1,
		transition: {
			staggerChildren: 0.04,
		},
	},
};

export default function MovieGrid({ movies, title }: Props) {
	return (
		<section className="mt-6">
			{title && (
				<h2 className="text-xl md:text-2xl font-semibold text-zinc-100 mb-3">
					{title}
				</h2>
			)}

			<motion.div
				variants={containerVariants}
				initial="hidden"
				animate="show"
				className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
			>
				{movies.map((m, idx) => (
					<MovieCard key={m.id} movie={m} index={idx} />
				))}
			</motion.div>
		</section>
	);
}
