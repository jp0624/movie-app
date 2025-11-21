import MovieCard from "../components/MovieCard";
import { useState, useEffect } from "react";
import { getPopularMovies, searchMovies } from "../services/api";
import "../styles/Home.css";

function Home() {
	// const [searchQuery, setSearchQuery] = useState("");
	const [movies, setMovies] = useState([]);
	const [error, setError] = useState("");
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchPopularMovies = async () => {
			try {
				const popularMovies = await getPopularMovies();
				setMovies(popularMovies);
			} catch (error) {
				setError(`Failed to load movies.`);
				console.error("Error fetching popular movies:", error);
			} finally {
				console.log("Finished fetching popular movies");
				setLoading(false);
			}
		};
		fetchPopularMovies();
	}, []);
	useEffect(() => {
		console.log("Movies updated: ", movies);
	}, [movies]);

	const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("search submitted");
	};
	const [searchQuery, setSearchQuery] = useState("");
	return (
		<>
			<div className="home">
				<form onSubmit={handleSearch} className="search-form">
					<input
						type="text"
						placeholder="Search movies..."
						className="search-input"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
					/>
					<button type="submit" className="search-button">
						Search
					</button>
				</form>
				<div className="movies-grid">
					{movies &&
						movies.map(
							(movie) =>
								movie.title
									.toLowerCase()
									.includes(searchQuery.toLowerCase()) && (
									<MovieCard key={movie.id} movie={movie} />
								)
						)}
				</div>
			</div>
		</>
	);
}

export default Home;
