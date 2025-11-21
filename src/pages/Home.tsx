import { useEffect, useState } from "react";
// import { Movie } from "../types/Movie";

import {
	getPopular,
	getTopRated,
	getTrending,
	getNowPlaying,
	searchMovies,
} from "../services/api";

import MovieCard from "../components/MovieCard";
import Tabs from "../components/Tabs";
import useDebounce from "../hooks/useDebounce";
import useInfiniteScroll from "../hooks/useInfiniteScroll";

export default function Home() {
	const [query, setQuery] = useState("");
	const debounced = useDebounce(query, 350);

	const [tab, setTab] = useState("Popular");
	const [movies, setMovies] = useState<[]>([]);
	const [page, setPage] = useState(1);

	const loadMovies = async (reset = false) => {
		const pageToLoad = reset ? 1 : page;
		let data: { results: [] };

		if (debounced) {
			data = await searchMovies(debounced, pageToLoad);
		} else {
			if (tab === "Popular") data = await getPopular(pageToLoad);
			if (tab === "Top Rated") data = await getTopRated(pageToLoad);
			if (tab === "Trending") data = await getTrending(pageToLoad);
			if (tab === "Now Playing") data = await getNowPlaying(pageToLoad);
		}

		setMovies((prev) => (reset ? data.results : [...prev, ...data.results]));
	};

	useEffect(() => {
		setMovies([]);
		setPage(1);
		loadMovies(true);
	}, [tab, debounced]);

	useInfiniteScroll(() => {
		setPage((p) => p + 1);
		loadMovies(false);
	});

	return (
		<div className="p-6">
			<form
				onSubmit={(e) => e.preventDefault()}
				className="max-w-xl mx-auto mb-8"
			>
				<input
					className="w-full bg-gray-800 text-white p-3 rounded"
					placeholder="Search movies..."
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</form>

			<Tabs active={tab} setActive={setTab} />

			<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
				{movies.map((m) => (
					<MovieCard key={m.id} movie={m} />
				))}
			</div>

			<div id="infinite-trigger" className="h-12"></div>
		</div>
	);
}
