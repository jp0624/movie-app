// src/pages/Home.tsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import Tabs from "../components/Tabs";
import useDebounce from "../hooks/useDebounce";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import MovieSkeleton from "../components/media/MovieSkeleton";
import ParallaxHero, {
	type HeroSlide,
} from "../components/layout/ParallaxHero";

type Mode = "movie" | "tv";

export default function Home() {
	/* --------------------------------------------------
	   State
	-------------------------------------------------- */
	const [mode, setMode] = useState<Mode>(() => {
		const stored =
			typeof window !== "undefined"
				? window.sessionStorage.getItem("mediaMode")
				: null;
		return stored === "tv" ? "tv" : "movie";
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
	const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

	// Hero slides (separate arrays for movies vs TV)
	const [heroMovieSlides, setHeroMovieSlides] = useState<HeroSlide[]>([]);
	const [heroTvSlides, setHeroTvSlides] = useState<HeroSlide[]>([]);

	/* --------------------------------------------------
	   Persist selections
	-------------------------------------------------- */
	useEffect(() => {
		window.sessionStorage.setItem("search", query);
	}, [query]);

	useEffect(() => {
		window.sessionStorage.setItem("mediaMode", mode);
	}, [mode]);

	/* --------------------------------------------------
	   Load Hero (Top 10 trending Movies + TV)
	-------------------------------------------------- */
	useEffect(() => {
		let cancelled = false;

		const loadHero = async () => {
			try {
				const [movieTrend, tvTrend] = await Promise.all([
					getTrending(1),
					getTrendingTv(1),
				]);

				if (cancelled) return;

				const movies = (movieTrend.results ?? [])
					.slice(0, 10)
					.map<HeroSlide>((m) => ({
						id: m.id,
						backdropUrl: m.backdrop_path
							? `https://image.tmdb.org/t/p/original${m.backdrop_path}`
							: m.poster_path
							? `https://image.tmdb.org/t/p/w780${m.poster_path}`
							: "/no-image.png",
						posterUrl: m.poster_path
							? `https://image.tmdb.org/t/p/w500${m.poster_path}`
							: undefined,
						title: m.title || m.name,
						year: m.release_date ? m.release_date.split("-")[0] : undefined,
						overview: m.overview,
						score: m.vote_average ?? null,
						mediaType: "movie",
						link: `/movie/${m.id}`,
						extra: m,
					}));

				const tv = (tvTrend.results ?? []).slice(0, 10).map<HeroSlide>((t) => ({
					id: t.id,
					backdropUrl: t.backdrop_path
						? `https://image.tmdb.org/t/p/original${t.backdrop_path}`
						: t.poster_path
						? `https://image.tmdb.org/t/p/w780${t.poster_path}`
						: "/no-image.png",
					posterUrl: t.poster_path
						? `https://image.tmdb.org/t/p/w500${t.poster_path}`
						: undefined,
					title: t.name || t.original_name,
					year: t.first_air_date ? t.first_air_date.split("-")[0] : undefined,
					overview: t.overview,
					score: t.vote_average ?? null,
					mediaType: "tv",
					link: `/tv/${t.id}`,
					extra: t,
				}));

				setHeroMovieSlides(movies);
				setHeroTvSlides(tv);
			} catch {
				// Hero is "nice to have" — fail silently, grid still works.
			}
		};

		void loadHero();
		return () => {
			cancelled = true;
		};
	}, []);

	const activeHeroSlides = mode === "movie" ? heroMovieSlides : heroTvSlides;

	/* --------------------------------------------------
	   Reset Grid when search/mode/tab changes
	-------------------------------------------------- */
	useEffect(() => {
		setItems([]);
		setPage(1);
		setHasMore(true);
		setIsInitialLoadDone(false);
	}, [tab, debounced, mode]);

	/* --------------------------------------------------
	   Load Main Grid
	-------------------------------------------------- */
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
					} else if (tab === "Popular") {
						data = await getPopular(currentPage);
					} else if (tab === "Top Rated") {
						data = await getTopRated(currentPage);
					} else if (tab === "Trending") {
						data = await getTrending(currentPage);
					} else {
						data = await getNowPlaying(currentPage);
					}
				} else {
					if (searching) {
						data = await searchTv(debounced, currentPage);
					} else if (tab === "Popular") {
						data = await getPopularTv(currentPage);
					} else if (tab === "Top Rated") {
						data = await getTopRatedTv(currentPage);
					} else if (tab === "Trending") {
						data = await getTrendingTv(currentPage);
					} else {
						data = await getOnTheAirTv(currentPage);
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

				if (!isInitialLoadDone) setIsInitialLoadDone(true);
			} finally {
				if (!cancelled) setIsLoading(false);
			}
		};

		void load();
		return () => {
			cancelled = true;
		};
	}, [page, tab, debounced, mode, hasMore, isInitialLoadDone]);

	/* --------------------------------------------------
	   Infinite Scroll
	-------------------------------------------------- */
	useInfiniteScroll(() => {
		if (!isInitialLoadDone) return;
		if (!isLoading && hasMore) setPage((p) => p + 1);
	});

	/* --------------------------------------------------
	   Render
	-------------------------------------------------- */
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-background pt-20 pb-10"
		>
			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				{/* ----------------------------------------------
				   HERO (Parallax + Glass + Slideshow)
				---------------------------------------------- */}
				{activeHeroSlides.length > 0 && (
					<div className="mb-7">
						<ParallaxHero slides={activeHeroSlides} autoAdvanceMs={5000}>
							{({ slide, isMulti }) => (
								<>
									<p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-accent">
										Trending {slide.mediaType === "tv" ? "Series" : "Movie"}
									</p>

									{isMulti ? (
										<h1 className="max-w-xl text-2xl font-semibold text-foreground sm:text-3xl lg:text-4xl">
											{slide.title ?? "Untitled"}
											{slide.year && (
												<span className="ml-2 text-lg font-normal text-muted">
													({slide.year})
												</span>
											)}
										</h1>
									) : (
										<h2 className="max-w-xl text-2xl font-semibold text-foreground sm:text-3xl lg:text-4xl">
											{slide.title ?? "Untitled"}
											{slide.year && (
												<span className="ml-2 text-lg font-normal text-muted">
													({slide.year})
												</span>
											)}
										</h2>
									)}

									{slide.overview && (
										<p className="mt-3 max-w-xl text-sm text-muted line-clamp-3">
											{slide.overview}
										</p>
									)}

									<div className="mt-3 flex items-center gap-3 text-xs text-muted">
										{slide.score != null && (
											<span className="flex items-center gap-1">
												<span className="text-base text-yellow-400">★</span>
												{slide.score.toFixed(1)} / 10
											</span>
										)}
									</div>

									<div className="mt-5">
										{slide.link && (
											<Link
												to={slide.link}
												className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-card transition-colors hover:bg-accent-soft"
											>
												View details
											</Link>
										)}
									</div>
								</>
							)}
						</ParallaxHero>
					</div>
				)}

				{/* ----------------------------------------------
				   TITLE + MODE TOGGLE
				---------------------------------------------- */}
				<div className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-center sm:justify-between">
					<h2 className="text-2xl font-semibold text-foreground sm:text-3xl">
						Discover {mode === "movie" ? "Movies" : "TV Shows"}
					</h2>

					{/* ----------------------------------------------
				   TABS
				---------------------------------------------- */}
					<Tabs
						tabs={[
							{ id: "movie", label: "Movies" },
							{ id: "tv", label: "TV Shows" },
						]}
						value={mode}
						onChange={(id) => setMode(id as "movie" | "tv")}
					/>
				</div>

				{/* ----------------------------------------------
				   SEARCH BAR
				---------------------------------------------- */}
				<form
					onSubmit={(e) => e.preventDefault()}
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
						>
							×
						</button>
					)}
				</form>

				{/* ----------------------------------------------
				   GRID
				---------------------------------------------- */}
				{items.length === 0 && isLoading ? (
					<div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
						{Array.from({ length: 10 }).map((_, i) => (
							<MovieSkeleton key={i} />
						))}
					</div>
				) : (
					<MovieGrid movies={items} mediaType={mode} className="mt-6" />
				)}

				{isLoading && items.length > 0 && (
					<div className="mt-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
						{Array.from({ length: 5 }).map((_, i) => (
							<MovieSkeleton key={`more-${i}`} />
						))}
					</div>
				)}
			</section>

			{/* Infinite scroll anchor */}
			<div id="infinite-trigger" className="h-12" />
		</motion.div>
	);
}
