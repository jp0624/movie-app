import { useEffect, useState, useCallback } from "react";
import type { Movie } from "../types/Movie";

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
	// --- SEARCH ---
	const [query, setQuery] = useState("");
	const debounced = useDebounce(query, 350);

	// --- TABS ---
	const [tab, setTab] = useState("Popular");

	// --- MOVIE DATA ---
	const [movies, setMovies] = useState<Movie[]>([]);
	const [page, setPage] = useState(1);
	const [loading, setLoading] = useState(false);

	// ---------------------------------------------
	// Fetch movies
	// ---------------------------------------------
	const loadMovies = useCallback(
		async (pageToLoad: number, reset: boolean) => {
			try {
				setLoading(true);

				let data: { results: Movie[] };

				// If searching
				if (debounced.trim().length > 0) {
					data = await searchMovies(debounced, pageToLoad);
				} else {
					if (tab === "Popular") data = await getPopular(pageToLoad);
					else if (tab === "Top Rated") data = await getTopRated(pageToLoad);
					else if (tab === "Trending") data = await getTrending(pageToLoad);
					else data = await getNowPlaying(pageToLoad);
				}

				setMovies((prev) =>
					reset ? data.results : [...prev, ...data.results]
				);
			} finally {
				setLoading(false);
			}
		},
		[tab, debounced]
	);

	// ---------------------------------------------
	// When tab or search changes → reset + load page 1
	// ---------------------------------------------
	useEffect(() => {
		setMovies([]);
		setPage(1);
	}, [tab, debounced]);

	// ---------------------------------------------
	// Load whenever "page" changes
	// ---------------------------------------------
	useEffect(() => {
		loadMovies(page, page === 1);
	}, [page, loadMovies]);

	// ---------------------------------------------
	// Infinite scroll
	// Only triggers when NOT loading
	// ---------------------------------------------
	useInfiniteScroll(
		useCallback(() => {
			if (!loading) {
				setPage((p) => p + 1);
			}
		}, [loading])
	);

	// ---------------------------------------------
	// Render
	// ---------------------------------------------
	return (
		<div className="p-6">
			{/* Search */}
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

			{/* Tabs */}
			<Tabs active={tab} setActive={setTab} />

			{/* Grid */}
			<div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
				{movies.map((m) => (
					<MovieCard key={m.id} movie={m} />
				))}
			</div>

			{/* Infinite Scroll Trigger */}
			<div id="infinite-trigger" className="h-16"></div>

			{/* Loading indicator */}
			{loading && (
				<p className="text-center text-gray-400 mt-4">Loading more…</p>
			)}
		</div>
	);
}
