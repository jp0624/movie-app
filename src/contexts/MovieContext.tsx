// src/contexts/MovieContext.tsx
import { createContext, useContext, useState } from "react";

interface MovieCtx {
	favorites: number[];
	addFavorite: (id: number) => void;
	removeFavorite: (id: number) => void;
}

const MovieContext = createContext<MovieCtx | null>(null);

export function MovieProvider({ children }: { children: React.ReactNode }) {
	const [favorites, setFavorites] = useState<number[]>(() => {
		try {
			return JSON.parse(localStorage.getItem("favorites") ?? "[]");
		} catch {
			return [];
		}
	});

	function save(next: number[]) {
		setFavorites(next);
		localStorage.setItem("favorites", JSON.stringify(next));
	}

	return (
		<MovieContext.Provider
			value={{
				favorites,
				addFavorite: (id) => save([...favorites, id]),
				removeFavorite: (id) => save(favorites.filter((x) => x !== id)),
			}}
		>
			{children}
		</MovieContext.Provider>
	);
}

export function useMovieContext() {
	const ctx = useContext(MovieContext);
	if (!ctx) throw new Error("useMovieContext must be inside <MovieProvider>");
	return ctx;
}
