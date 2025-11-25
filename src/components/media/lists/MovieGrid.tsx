// src/components/media/lists/MovieGrid.tsx
import MovieCard from "../cards/MovieCard";

interface Props {
	movies: any[];
	className?: string;
}

export default function MovieGrid({ movies, className = "" }: Props) {
	if (!Array.isArray(movies)) return null;

	return (
		<div
			className={
				"grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 " + className
			}
		>
			{movies.map((m) => (m ? <MovieCard key={m.id} movie={m} /> : null))}
		</div>
	);
}
