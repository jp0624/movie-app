// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import type { Movie } from "../types/Movie";
import type { TvShow } from "../types/Tv";

import {
	getPopular,
	getTopRated,
	getTrending,
	getNowPlaying,
	getPopularTv,
	getTopRatedTv,
	getTrendingTv,
	getOnTheAirTv,
	searchMovies,
	searchTv,
} from "../services/api";

import MovieGrid from "../components/media/MovieGrid";
import Tabs from "../components/Tabs"; // your 4-tab component (Popular / Top Rated / Trending / Now Playing / On The Air)
import useDebounce from "../hooks/useDebounce";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import MovieSkeleton from "../components/media/MovieSkeleton";

type Mode = "movie" | "tv";

export default function Home() {
	const [mode, setMode] = useState<Mode>(() => {
		if (typeof window !== "undefined") {
			const stored = window.sessionStorage.getItem("mediaMode");
			if (stored === "movie" || stored === "tv") return stored;
		}
		return "movie";
	});

	const [query, setQuery] = useState(() => {
		if (typeof window !== "undefined") {
			return window.sessionStorage.getItem("search") ?? "";
		}
		return "";
	});

	const debounced = useDebounce(query, 350);

	const [tab, setTab] = useState("Popular");
	const [items, setItems] = useState<(Movie | TvShow)[]>([]);
	const [page, setPage] = useState(1);
	const [isLoading, setIsLoading] = useState(false);
	const [hasMore, setHasMore] = useState(true);

	// Persist search & mode
	useEffect(() => {
		if (typeof window !== "undefined") {
			window.sessionStorage.setItem("search", query);
		}
	}, [query]);

	useEffect(() => {
		if (typeof window !== "undefined") {
			window.sessionStorage.setItem("mediaMode", mode);
		}
	}, [mode]);

	// Reset list when tab / search / mode changes
	useEffect(() => {
		setItems([]);
		setPage(1);
		setHasMore(true);
	}, [tab, debounced, mode]);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			if (!hasMore) return;
			setIsLoading(true);

			try {
				const currentPage = page;
				let data: { results: (Movie | TvShow)[] } = { results: [] };

				const searching = !!debounced;

				if (mode === "movie") {
					if (searching) {
						data = await searchMovies(debounced, currentPage);
					} else {
						if (tab === "Popular") data = await getPopular(currentPage);
						else if (tab === "Top Rated") data = await getTopRated(currentPage);
						else if (tab === "Trending") data = await getTrending(currentPage);
						else data = await getNowPlaying(currentPage);
					}
				} else {
					if (searching) {
						data = await searchTv(debounced, currentPage);
					} else {
						if (tab === "Popular") data = await getPopularTv(currentPage);
						else if (tab === "Top Rated")
							data = await getTopRatedTv(currentPage);
						else if (tab === "Trending")
							data = await getTrendingTv(currentPage);
						else data = await getOnTheAirTv(currentPage);
					}
				}

				if (cancelled) return;

				const results = data.results ?? [];

				setItems((prev) => {
					const merged = currentPage === 1 ? results : [...prev, ...results];
					const seen = new Set<number>();
					return merged.filter((m: any) => {
						if (!m?.id || seen.has(m.id)) return false;
						seen.add(m.id);
						return true;
					});
				});

				setHasMore(results.length > 0);
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		};

		void load();

		return () => {
			cancelled = true;
		};
	}, [page, tab, debounced, mode, hasMore]);

	// Infinite scroll
	useInfiniteScroll(() => {
		if (!isLoading && hasMore) {
			setPage((p) => p + 1);
		}
	});

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-background pb-10"
		>
			<section className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
				{/* Title + Mode toggle */}
				<div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
					<motion.h1
						initial={{ y: 20, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						transition={{ duration: 0.5, ease: "easeOut" }}
						className="text-2xl font-semibold text-foreground sm:text-3xl"
					>
						Discover {mode === "movie" ? "Movies" : "TV Shows"}
					</motion.h1>

					{/* Movie / TV toggle (Mac-style pill) */}
					<div className="inline-flex rounded-full bg-surface-alt border border-token px-1 py-1 text-xs shadow-card">
						<button
							type="button"
							onClick={() => setMode("movie")}
							className={`relative z-10 rounded-full px-3 py-1 transition-colors ${
								mode === "movie"
									? "bg-background text-foreground shadow-card"
									: "text-muted hover:text-foreground"
							}`}
						>
							Movies
						</button>
						<button
							type="button"
							onClick={() => setMode("tv")}
							className={`relative z-10 rounded-full px-3 py-1 transition-colors ${
								mode === "tv"
									? "bg-background text-foreground shadow-card"
									: "text-muted hover:text-foreground"
							}`}
						>
							TV Shows
						</button>
					</div>
				</div>

				{/* Search */}
				<motion.form
					onSubmit={(e) => e.preventDefault()}
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="relative mb-4 sm:mb-6"
				>
					<input
						className="w-full rounded-lg border border-token bg-surface px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
						placeholder={
							mode === "movie" ? "Search movies…" : "Search TV shows…"
						}
						value={query}
						onChange={(e) => setQuery(e.target.value)}
					/>
					{query.length > 0 && (
						<button
							type="button"
							onClick={() => setQuery("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-muted hover:text-foreground"
							aria-label="Clear search"
						>
							×
						</button>
					)}
				</motion.form>

				{/* Tabs (Popular, Top Rated, Trending, Now Playing / On The Air) */}
				<Tabs active={tab} setActive={setTab} />

				{/* Grid */}
				{items.length === 0 && isLoading ? (
					<div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
						{Array.from({ length: 10 }).map((_, i) => (
							<MovieSkeleton key={i} />
						))}
					</div>
				) : (
					<MovieGrid
						movies={items as Movie[]}
						mediaType={mode}
						className="mt-6"
					/>
				)}

				{/* Loading more shimmer */}
				{isLoading && items.length > 0 && (
					<div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
						{Array.from({ length: 5 }).map((_, i) => (
							<MovieSkeleton key={`more-${i}`} />
						))}
					</div>
				)}
			</section>

			{/* Infinite scroll trigger */}
			<div id="infinite-trigger" className="h-12" />
		</motion.div>
	);
}
