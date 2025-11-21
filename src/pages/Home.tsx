import MovieCard from "../components/MovieCard";
import { useState } from "react";
import "../styles/Home.css";

function Home() {
	const movies = [
		{
			Title: "Inception",
			Poster: "https://example.com/inception.jpg",
			release_date: "2010-07-16",
			id: 0,
		},
		{
			Title: "The Matrix",
			Poster: "https://example.com/matrix.jpg",
			release_date: "1999-03-31",
			id: 1,
		},
		{
			Title: "Interstellar",
			Poster: "https://example.com/interstellar.jpg",
			release_date: "2014-11-05",
			id: 2,
		},
		{
			Title: "Avatar",
			Poster: "https://example.com/avatar.jpg",
			release_date: "2009-12-10",
			id: 3,
		},
		{
			Title: "The Dark Knight",
			Poster: "https://example.com/dark_knight.jpg",
			release_date: "2008-07-18",
			id: 4,
		},
		{
			Title: "The Avengers",
			Poster: "https://example.com/avengers.jpg",
			release_date: "2012-04-25",
			id: 5,
		},
	];

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
					{movies.map(
						(movie) =>
							movie.Title.toLowerCase().includes(searchQuery.toLowerCase()) && (
								<MovieCard key={movie.id} movie={movie} />
							)
					)}
				</div>
			</div>
		</>
	);
}

export default Home;
