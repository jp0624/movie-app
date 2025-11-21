// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import type { Movie } from "../types/Movie";
import {
	getPopular,
	getTopRated,
	getTrending,
	getNowPlaying,
	searchMovies,
} from "../services/api";
import MovieGrid from "../components/MovieGrid";
import Tabs from "../components/Tabs";
import useDebounce from "../hooks/useDebounce";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import MovieSkeleton from "../components/MovieSkeleton";

const TAB_LABELS = ["Popular", "Top Rated", "Trending", "Now Playing"] as const;
type TabKey = (typeof TAB_LABELS)[number];

export default function Home() {
	const [query, setQuery] = useState("");
	const debounced = useDebounce(query, 350);

	const [tab, setTab] = useState<TabKey>("Popular");
	const [movies, setMovies] = useState<Movie[]>([]);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	// Reset when tab or search changes
	useEffect(() => {
		setMovies([]);
		setPage(1);
		setHasMore(true);
	}, [tab, debounced]);

	useEffect(() => {
		const load = async () => {
			setIsLoading(true);
			let data: { results: Movie[] } = { results: [] };

			const currentPage = page;

			if (debounced) {
				data = await searchMovies(debounced, currentPage);
			} else {
				if (tab === "Popular") data = await getPopular(currentPage);
				if (tab === "Top Rated") data = await getTopRated(currentPage);
				if (tab === "Trending") data = await getTrending(currentPage);
				if (tab === "Now Playing") data = await getNowPlaying(currentPage);
			}

			const results = data.results ?? [];

			setMovies((prev) => {
				const merged = currentPage === 1 ? results : [...prev, ...results];
				const seen = new Set<number>();
				return merged.filter((m) => {
					if (!m.id || seen.has(m.id)) return false;
					seen.add(m.id);
					return true;
				});
			});

			setHasMore(results.length > 0);
			setIsLoading(false);
		};

		if (hasMore) {
			void load();
		}
	}, [page, tab, debounced, hasMore]);

	useInfiniteScroll(() => {
		if (!isLoading && hasMore) {
			setPage((p) => p + 1);
		}
	});

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="px-4 py-6 bg-zinc-950 min-h-screen text-zinc-100"
		>
			<section className="max-w-4xl mx-auto">
				<motion.h1
					initial={{ y: 20, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					className="text-3xl md:text-4xl font-bold mb-4"
				>
					Discover Movies
				</motion.h1>

				<motion.form
					onSubmit={(e) => e.preventDefault()}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					className="mb-4"
				>
					<input
						className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-4 py-3 text-sm md:text-base text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-500"
						placeholder="Search movies..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
				</motion.form>

				<Tabs active={tab} setActive={setTab} />

				{movies.length === 0 && isLoading ? (
					<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6">
						{Array.from({ length: 8 }).map((_, i) => (
							<MovieSkeleton key={i} />
						))}
					</div>
				) : (
					<MovieGrid movies={movies} />
				)}

				{isLoading && movies.length > 0 && (
					<div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{Array.from({ length: 4 }).map((_, i) => (
							<MovieSkeleton key={i} />
						))}
					</div>
				)}
			</section>

			<div id="infinite-trigger" className="h-12" />
		</motion.div>
	);
}
