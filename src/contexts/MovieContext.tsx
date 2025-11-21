import { createContext, useState, useContext, useEffect } from "react";

const MovieContext = createContext<any>(null);

export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }: { children: React.ReactNode }) => {
	const [favorites, setFavorites] = useState<number[]>([]);

	useEffect(() => {
		const storedFavorites = localStorage.getItem("favorites");
		if (storedFavorites) {
			setFavorites(JSON.parse(storedFavorites));
		}
	}, []);

	useEffect(() => {
		localStorage.setItem("favorites", JSON.stringify(favorites));
	}, [favorites]);

	const addToFavorites = (movieId: number) => {
		if (!favorites.includes(movieId)) {
			setFavorites([...favorites, movieId]);
		}
		console.log("favorites: ", favorites);
		console.log("add to favorites: ", movieId);
	};

	const removeFromFavorites = (movieId: number) => {
		setFavorites(favorites.filter((fav) => fav !== movieId));
		console.log("favorites: ", favorites);
		console.log("remove from favorites: ", movieId);
	};

	const isFavorite = (movieId: number) =>
		favorites.some((movie) => movie === movieId);

	const value = {
		favorites,
		addToFavorites,
		removeFromFavorites,
		isFavorite,
	};

	return (
		<MovieContext.Provider value={value}>{children}</MovieContext.Provider>
	);
};
