import {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from "react";

interface MovieContextType {
	favorites: number[];
	toggleFavorite: (id: number) => void;

	ratings: Record<number, number>;
	setRating: (id: number, rating: number) => void;
}

const MovieContext = createContext<MovieContextType | null>(null);

export function MovieProvider({ children }: { children: ReactNode }) {
	const [favorites, setFavorites] = useState<number[]>(() => {
		const stored = localStorage.getItem("favorites");
		return stored ? JSON.parse(stored) : [];
	});

	const [ratings, setRatings] = useState<Record<number, number>>(() => {
		const stored = localStorage.getItem("ratings");
		return stored ? JSON.parse(stored) : {};
	});

	useEffect(() => {
		localStorage.setItem("favorites", JSON.stringify(favorites));
	}, [favorites]);

	useEffect(() => {
		localStorage.setItem("ratings", JSON.stringify(ratings));
	}, [ratings]);

	const toggleFavorite = (id: number) => {
		setFavorites((prev) =>
			prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
		);
	};

	const setRating = (id: number, rating: number) => {
		setRatings((prev) => ({
			...prev,
			[id]: rating,
		}));
	};

	return (
		<MovieContext.Provider
			value={{ favorites, toggleFavorite, ratings, setRating }}
		>
			{children}
		</MovieContext.Provider>
	);
}

export function useMovie() {
	const ctx = useContext(MovieContext);
	if (!ctx) throw new Error("useMovie must be inside <MovieProvider>");
	return ctx;
}
