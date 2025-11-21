import { useMovie } from "../contexts/MovieContext";
import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
	const { favorites, toggleFavorite, ratings, setRating } = useMovie();
	const isFav = favorites.includes(movie.id);

	return (
		<div className="bg-gray-900 rounded-xl overflow-hidden hover:scale-[1.02] shadow transition">
			<Link to={`/movie/${movie.id}`}>
				<img
					src={
						movie.poster_path
							? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
							: "/no-image.png"
					}
					className="w-full"
				/>
			</Link>

			<div className="p-4 text-white">
				<h3 className="font-semibold">{movie.title ?? movie.name}</h3>
				<p className="text-gray-400 text-sm">
					{movie.release_date?.split("-")[0] ?? ""}
				</p>

				<div className="flex justify-between items-center mt-3">
					<button
						onClick={() => toggleFavorite(movie.id)}
						className={`text-2xl ${isFav ? "text-red-500" : "text-gray-300"}`}
					>
						♥
					</button>

					<select
						value={ratings[movie.id] ?? ""}
						onChange={(e) => setRating(movie.id, Number(e.target.value))}
						className="bg-gray-800 p-1 rounded"
					>
						<option value="">Rate</option>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
							<option key={n} value={n}>
								{n}
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
}
