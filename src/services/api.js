const API_KEY = "your_api_key_here";
const BASE_URL = "https://www.omdbapi.com/";

export async function fetchMovies(searchTerm) {
	const response = await fetch(`${BASE_URL}?s=${searchTerm}&apikey=${API_KEY}`);
	const data = await response.json();
	return data.Search || [];
}

export async function fetchMovieDetails(imdbID) {
	const response = await fetch(`${BASE_URL}?i=${imdbID}&apikey=${API_KEY}`);
	const data = await response.json();
	return data;
}
