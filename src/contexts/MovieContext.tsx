import { createContext, useContext, useEffect, useState } from "react";

interface MovieCtx {
	favorites: number[];
	toggleFavorite(id: number): void;

	ratings: Record<number, number>;
	setRating(id: number, v: number): void;

	theme: "light" | "dark";
	toggleTheme(): void;
}

const MovieContext = createContext<MovieCtx | null>(null);

export const useMovie = () => {
	const ctx = useContext(MovieContext);
	if (!ctx) throw new Error("MovieContext missing");
	return ctx;
};

export const MovieProvider = ({ children }) => {
	const [favorites, setFavorites] = useState<number[]>([]);
	const [ratings, setRatings] = useState<Record<number, number>>({});
	const [theme, setTheme] = useState<"light" | "dark">("dark");

	useEffect(() => {
		const f = localStorage.getItem("favorites");
		if (f) setFavorites(JSON.parse(f));

		const r = localStorage.getItem("ratings");
		if (r) setRatings(JSON.parse(r));

		const t = localStorage.getItem("theme");
		if (t === "light") setTheme("light");
	}, []);

	useEffect(
		() => localStorage.setItem("favorites", JSON.stringify(favorites)),
		[favorites]
	);
	useEffect(
		() => localStorage.setItem("ratings", JSON.stringify(ratings)),
		[ratings]
	);
	useEffect(() => {
		localStorage.setItem("theme", theme);
		document.documentElement.classList.toggle("dark", theme === "dark");
	}, [theme]);

	return (
		<MovieContext.Provider
			value={{
				favorites,
				toggleFavorite: (id) =>
					setFavorites((prev) =>
						prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
					),

				ratings,
				setRating: (id, v) => setRatings((prev) => ({ ...prev, [id]: v })),

				theme,
				toggleTheme: () => setTheme((t) => (t === "dark" ? "light" : "dark")),
			}}
		>
			{children}
		</MovieContext.Provider>
	);
};
