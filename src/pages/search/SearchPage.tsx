// src/pages/search/SearchPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import useDebounce from "../../hooks/useDebounce";
import { searchMulti } from "../../services/api";

type MediaTypeFilter = "all" | "movie" | "tv" | "person";
type OrderBy = "default" | "popular" | "top_rated" | "trending" | "now_playing";

interface MultiResultBase {
	id: number;
	media_type: "movie" | "tv" | "person";
	popularity?: number;
	vote_average?: number;
	vote_count?: number;
	poster_path?: string | null;
	profile_path?: string | null;
	backdrop_path?: string | null;
	overview?: string;
	name?: string;
	title?: string;
	release_date?: string;
	first_air_date?: string;
}

type MultiResult = MultiResultBase;

const typeLabel: Record<MediaTypeFilter, string> = {
	all: "All",
	movie: "Movies",
	tv: "TV Shows",
	person: "People",
};

const orderLabel: Record<OrderBy, string> = {
	default: "All",
	popular: "Popular",
	top_rated: "Top Rated",
	trending: "Trending",
	now_playing: "Now Playing",
};

const statusOptions = [
	"",
	"Rumored",
	"Planned",
	"In Production",
	"Post Production",
	"Released",
	"Canceled",
	"Returning Series",
	"Ended",
];

const streamingOptions = [
	"",
	"Netflix",
	"Disney+",
	"Prime Video",
	"HBO Max",
	"Hulu",
	"Apple TV+",
	"Paramount+",
	"Crave",
];

export default function SearchPage() {
	const [query, setQuery] = useState("");
	const debounced = useDebounce(query, 400);

	const [typeFilter, setTypeFilter] = useState<MediaTypeFilter>("all");
	const [yearFrom, setYearFrom] = useState<string>("");
	const [yearTo, setYearTo] = useState<string>("");
	const [status, setStatus] = useState<string>("");
	const [streaming, setStreaming] = useState<string>("");

	const [minRating, setMinRating] = useState<number>(0);
	const [orderBy, setOrderBy] = useState<OrderBy>("default");

	const [results, setResults] = useState<MultiResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		let cancelled = false;

		const load = async () => {
			if (!debounced.trim()) {
				setResults([]);
				setError(null);
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const res = await searchMulti(debounced, 1);
				if (cancelled) return;

				setResults(res.results ?? []);
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error
							? err.message
							: "Failed to search, please retry."
					);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		void load();
		return () => {
			cancelled = true;
		};
	}, [debounced]);

	const filteredSorted = useMemo(() => {
		let items = [...results];

		if (typeFilter !== "all") {
			items = items.filter((r) => r.media_type === typeFilter);
		}

		if (yearFrom) {
			const yf = Number(yearFrom);
			if (!Number.isNaN(yf)) {
				items = items.filter((r) => {
					const d = r.release_date || r.first_air_date || "";
					const y = d ? Number(String(d).split("-")[0]) : NaN;
					return !Number.isNaN(y) && y >= yf;
				});
			}
		}

		if (yearTo) {
			const yt = Number(yearTo);
			if (!Number.isNaN(yt)) {
				items = items.filter((r) => {
					const d = r.release_date || r.first_air_date || "";
					const y = d ? Number(String(d).split("-")[0]) : NaN;
					return !Number.isNaN(y) && y <= yt;
				});
			}
		}

		if (minRating > 0) {
			items = items.filter((r) => (r.vote_average ?? 0) >= minRating);
		}

		if (status) {
			items = items.filter((r) => {
				const anyR = r as any;
				return anyR.status ? anyR.status === status : true;
			});
		}

		if (streaming) {
			items = items.filter((r) => {
				const anyR = r as any;
				const providers: string[] = anyR.streamingProviders ?? [];
				if (!providers || providers.length === 0) return true;
				return providers.includes(streaming);
			});
		}

		switch (orderBy) {
			case "popular":
				items.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0));
				break;
			case "top_rated":
				items.sort((a, b) => (b.vote_average ?? 0) - (a.vote_average ?? 0));
				break;
			case "trending":
				items.sort((a, b) => (b.vote_count ?? 0) - (a.vote_count ?? 0));
				break;
			case "now_playing":
				items.sort((a, b) => {
					const da = a.release_date || a.first_air_date || "";
					const db = b.release_date || b.first_air_date || "";
					return db.localeCompare(da);
				});
				break;
			case "default":
			default:
				break;
		}

		return items;
	}, [
		results,
		typeFilter,
		yearFrom,
		yearTo,
		minRating,
		status,
		streaming,
		orderBy,
	]);

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-background pt-20 pb-10"
		>
			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<header className="mb-6 sm:mb-8">
					<h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
						Search
					</h1>
					<p className="mt-1 text-sm text-muted">
						Find movies, TV shows, and people across CineScope.
					</p>
				</header>

				{/* FILTERS */}
				<div className="mb-6 space-y-4 rounded-xl border border-token bg-surface p-4 shadow-card sm:p-5">
					{/* Row 1: Search + type pills */}
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex-1">
							<input
								className="w-full rounded-lg border border-token bg-surface-alt px-4 py-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
								placeholder="Search for a movie, TV show, or person…"
								value={query}
								onChange={(e) => setQuery(e.target.value)}
							/>
						</div>

						<div className="flex flex-wrap items-center gap-2 text-xs">
							{(["all", "movie", "tv", "person"] as MediaTypeFilter[]).map(
								(t) => (
									<button
										key={t}
										type="button"
										onClick={() => setTypeFilter(t)}
										className={`rounded-full border px-3 py-1 transition-colors ${
											typeFilter === t
												? "border-accent bg-accent text-white shadow-card"
												: "border-token bg-surface-alt text-muted hover:text-foreground"
										}`}
									>
										{typeLabel[t]}
									</button>
								)
							)}
						</div>
					</div>

					{/* Row 2: Year From, Status, Min Rating slider */}
					<div className="grid gap-4 md:grid-cols-[1fr_1fr_2fr]">
						{/* Year From */}
						<div className="space-y-1">
							<label className="block text-xs font-medium uppercase tracking-wide text-muted">
								Year (From)
							</label>
							<input
								type="number"
								min={1900}
								max={2100}
								value={yearFrom}
								onChange={(e) => setYearFrom(e.target.value)}
								className="w-full rounded-lg border border-token bg-surface-alt px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
								placeholder="e.g. 2000"
							/>
						</div>

						{/* Status dropdown */}
						<div className="space-y-1">
							<label className="block text-xs font-medium uppercase tracking-wide text-muted">
								Status
							</label>
							<select
								value={status}
								onChange={(e) => setStatus(e.target.value)}
								className="w-full rounded-lg border border-token bg-surface-alt px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
							>
								<option value="">Any</option>
								{statusOptions.map((opt) =>
									opt ? (
										<option key={opt} value={opt}>
											{opt}
										</option>
									) : null
								)}
							</select>
						</div>

						{/* Min Rating slider */}
						<div className="space-y-1">
							<label className="block text-xs font-medium uppercase tracking-wide text-muted">
								Min Rating ({minRating.toFixed(1)})
							</label>
							<input
								type="range"
								min={0}
								max={10}
								step={0.5}
								value={minRating}
								onChange={(e) => setMinRating(Number(e.target.value))}
								className="w-full accent-accent"
							/>
						</div>
					</div>

					{/* Row 3: Year To, Streaming, Order By */}
					<div className="grid gap-4 md:grid-cols-[1fr_1fr_2fr]">
						{/* Year To */}
						<div className="space-y-1">
							<label className="block text-xs font-medium uppercase tracking-wide text-muted">
								Year (To)
							</label>
							<input
								type="number"
								min={1900}
								max={2100}
								value={yearTo}
								onChange={(e) => setYearTo(e.target.value)}
								className="w-full rounded-lg border border-token bg-surface-alt px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
								placeholder="e.g. 2024"
							/>
						</div>

						{/* Streaming */}
						<div className="space-y-1">
							<label className="block text-xs font-medium uppercase tracking-wide text-muted">
								Available On (Streaming)
							</label>
							<select
								value={streaming}
								onChange={(e) => setStreaming(e.target.value)}
								className="w-full rounded-lg border border-token bg-surface-alt px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
							>
								<option value="">Any</option>
								{streamingOptions.map((opt) =>
									opt ? (
										<option key={opt} value={opt}>
											{opt}
										</option>
									) : null
								)}
							</select>
						</div>

						{/* Order By pills */}
						<div className="space-y-1">
							<label className="block text-xs font-medium uppercase tracking-wide text-muted">
								Order By
							</label>
							<div className="flex flex-wrap gap-2 text-xs">
								{(
									[
										"default",
										"popular",
										"top_rated",
										"trending",
										"now_playing",
									] as OrderBy[]
								).map((o) => (
									<button
										key={o}
										type="button"
										onClick={() => setOrderBy(o)}
										className={`rounded-full border px-3 py-1 transition-colors ${
											orderBy === o
												? "border-accent bg-accent text-white shadow-card"
												: "border-token bg-surface-alt text-muted hover:text-foreground"
										}`}
									>
										{orderLabel[o]}
									</button>
								))}
							</div>
						</div>
					</div>
				</div>

				{/* RESULTS */}
				<section>
					{loading && (
						<p className="text-sm text-muted">
							Searching TMDB for “{debounced}”…
						</p>
					)}
					{error && !loading && (
						<p className="text-sm text-red-400">Error: {error}</p>
					)}
					{!loading && !error && debounced && filteredSorted.length === 0 && (
						<p className="text-sm text-muted">No results found.</p>
					)}

					<div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{filteredSorted.map((item) => {
							const isPerson = item.media_type === "person";
							const isTv = item.media_type === "tv";
							const title = isPerson
								? item.name
								: item.title || item.name || "Untitled";
							const date = item.release_date || item.first_air_date || "";
							const year = date ? date.split("-")[0] : "";
							const rating =
								!isPerson && item.vote_average != null
									? item.vote_average.toFixed(1)
									: null;
							const imgPath = isPerson
								? item.profile_path
								: item.poster_path || item.backdrop_path;
							const href = isPerson
								? `/person/${item.id}`
								: isTv
								? `/tv/${item.id}`
								: `/movie/${item.id}`;

							return (
								<Link
									key={`${item.media_type}-${item.id}`}
									to={href}
									className="group overflow-hidden rounded-xl border border-token bg-surface shadow-card transition-transform hover:-translate-y-0.5"
								>
									<div className="relative aspect-[2/3] overflow-hidden">
										<img
											src={
												imgPath
													? `https://image.tmdb.org/t/p/w500${imgPath}`
													: "/no-image.png"
											}
											alt={title}
											className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
									</div>
									<div className="space-y-1.5 p-3 text-sm">
										<p className="line-clamp-2 font-medium text-foreground">
											{title}
										</p>
										<div className="flex items-center justify-between text-xs text-muted">
											<span className="uppercase tracking-wide">
												{item.media_type}
											</span>
											{year && <span>{year}</span>}
										</div>
										{rating && (
											<div className="flex items-center gap-1 text-xs text-muted">
												<span className="text-yellow-400 text-sm">★</span>
												{rating}
											</div>
										)}
									</div>
								</Link>
							);
						})}
					</div>
				</section>
			</section>
		</motion.div>
	);
}
