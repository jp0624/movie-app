import "../styles/MovieCard.css";
interface Movie {
	title: string;
	poster_path: string;
	release_date: string;
}

function MovieCard({ movie }: { movie: Movie }) {
	function onFavoriteClick() {
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
					<button className="favorite-btn" onClick={onFavoriteClick}>
						♥
					</button>
				</div>
			</div>

			<div className="movie-info">
				<h3 className="movie-title">{movie.title}</h3>
				<p className="movie-release_date">{movie.release_date}</p>
			</div>
		</div>
	);
}

export default MovieCard;
