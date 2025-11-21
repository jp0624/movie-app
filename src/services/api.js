const API_KEY =
	"eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNGIzNjM4OGFkZjMzNDI0ZDg1MGE1N2Y2ZmU5ODYwMSIsIm5iZiI6MTc2MzczNzI4My4wNzcsInN1YiI6IjY5MjA3ZWMzMGIyOTM2MzM5NjIxYWRiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.zssnPmZ_zQWsqlKIkpqEmRpTXtA3IkUOlA4Wsrot-KQ";

const BASE_URL = "https://api.themoviedb.org/3";
const OPTIONS = {
	method: "GET",
	headers: {
		accept: "application/json",
		Authorization: `Bearer ${API_KEY}`,
	},
};

export const getPopularMovies = async () => {
	const response = await fetch(`${BASE_URL}/movie/popular`, OPTIONS);
	const data = await response.json();
	console.log(data);
	return data.results;
};

export const searchMovies = async (query) => {
	const response = await fetch(
		`${BASE_URL}/search/keyword?query=${encodeURIComponent(query)}`,
		OPTIONS
	);

	const data = await response.json();
	return data.results;
};

// const url = "https://api.themoviedb.org/3/search/keyword?query=testing&page=1";
// const options = {
// 	method: "GET",
// 	headers: {
// 		accept: "application/json",
// 		Authorization:
// 			"Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwMDRjMDFjZjU3MTY0OWE4YWNjMDk2YjIwODU4YTc1NiIsIm5iZiI6MTc2MzczNzI4My4wNzcsInN1YiI6IjY5MjA3ZWMzMGIyOTM2MzM5NjIxYWRiMiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.mVLZxdsAGtMfmf1WqW3ZIiCslLkKMsBpka29KBh8flc",
// 	},
// };

// fetch(url, options)
// 	.then((res) => res.json())
// 	.then((json) => console.log(json))
// 	.catch((err) => console.error(err));
