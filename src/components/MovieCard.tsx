import "../styles/MovieCard.css";
interface Movie {
	Title: string;
	Poster: string;
	release_date: string;
}

function MovieCard({ movie }: { movie: Movie }) {
	function onFavoriteClick() {
		console.log(`Favorite clicked for movie: ${movie.Title}`);
	}

	return (
		<div className="movie-card">
			<div className="movie-poster">
				<img src={movie.Poster} alt={`${movie.Title} Poster`} />
				<div className="overlay">
					<button className="favorite-btn" onClick={onFavoriteClick}>
						♥
					</button>
				</div>
			</div>

			<div className="movie-info">
				<h3 className="movie-title">{movie.Title}</h3>
				<p className="movie-release_date">{movie.release_date}</p>
			</div>
		</div>
	);
}

export default MovieCard;
