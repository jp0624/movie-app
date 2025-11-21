import "../styles/MovieCard.css";
import { useMovieContext } from "../contexts/MovieContext";
interface Movie {
	title: string;
	poster_path: string;
	release_date: string;
	id: number;
}

function MovieCard({ movie }: { movie: Movie }) {
	const { isFavorite, addToFavorites, removeFromFavorites } = useMovieContext();
	function onFavoriteClick(movieId: number) {
		if (isFavorite(movieId)) {
			removeFromFavorites(movieId);
		} else {
			addToFavorites(movieId);
		}
		console.log(`Favorite clicked for movie: ${movie.title}`);
	}

	return (
		<div className="movie-card">
			<div className="movie-poster">
				<img
					src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
					alt={`${movie.title} Poster`}
				/>
				<div className="overlay">
					<button
						className={`favorite-btn ${isFavorite(movie.id) ? "active" : ""}`}
						onClick={() => onFavoriteClick(movie.id)}
					>
						♥
					</button>
				</div>
			</div>

			<div className="movie-info">
				<h3 className="movie-title">{movie.title}</h3>
				<p className="movie-release_date">
					{movie.release_date?.split("-")[0] || "N/A"}
				</p>
			</div>
		</div>
	);
}

export default MovieCard;
