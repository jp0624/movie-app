// src/pages/search/SearchPage.tsx
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import useDebounce from "../../hooks/useDebounce";
import { searchMulti } from "../../services/api";
import { useAISuggestions } from "../../hooks/useAISuggestions";
import { useTmdbPreload } from "../../hooks/useTmdbPreload";

import Surface from "../../components/ui/Surface";
import SectionHeader from "../../components/ui/SectionHeader";
import MovieCard from "../../components/media/cards/MovieCard";

type MediaType = "movie" | "tv" | "person";

interface MultiResult {
	id: number;
	media_type: MediaType;
	title?: string;
	name?: string;
	overview?: string;
	popularity?: number;
	vote_average?: number;
	first_air_date?: string;
	release_date?: string;
	known_for_department?: string;
}

export default function SearchPage() {
	const [searchParams] = useSearchParams();
	const navigate = useNavigate();

	const initialQuery = searchParams.get("q") ?? "";
	const [query, setQuery] = useState(initialQuery);
	const debounced = useDebounce(query, 350);

	const [results, setResults] = useState<MultiResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const suggestions = useAISuggestions(query);
	const preload = useTmdbPreload((item: MultiResult) => {
		if (!item) return;
		return import("../../services/api").then((m) => {
			if (item.media_type === "movie") return m.getMovie(item.id);
			if (item.media_type === "tv") return m.getTv(item.id);
			return m.getPerson(item.id);
		});
	});

	// Keep URL in sync with query
	useEffect(() => {
		const params = new URLSearchParams();
		if (query.trim()) params.set("q", query.trim());
		navigate({ search: params.toString() }, { replace: true });
	}, [query, navigate]);

	// Load results from TMDB
	useEffect(() => {
		let cancelled = false;

		async function runSearch() {
			if (!debounced.trim()) {
				setResults([]);
				setError(null);
				return;
			}

			setLoading(true);
			setError(null);

			try {
				const data = await searchMulti(debounced.trim(), 1);
				if (cancelled) return;
				setResults((data.results ?? []) as MultiResult[]);
			} catch (err: any) {
				if (!cancelled) {
					setError(err?.message || "Failed to search.");
					setResults([]);
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		}

		void runSearch();
		return () => {
			cancelled = true;
		};
	}, [debounced]);

	// Simple scoring / fuzzy-ish relevance boost
	const scored = useMemo(() => {
		const q = debounced.trim().toLowerCase();
		if (!q) return results;

		const scoreItem = (item: MultiResult) => {
			const title = (item.title || item.name || "").toLowerCase();
			let score = 0;

			if (title.includes(q)) score += 3;
			if (title.startsWith(q)) score += 2;

			// word overlap
			const qWords = q.split(/\s+/);
			const tWords = title.split(/\s+/);
			const overlap = qWords.filter((w) => tWords.includes(w)).length;
			score += overlap;

			if (item.popularity) score += item.popularity / 100;
			if (item.vote_average) score += item.vote_average / 2;

			return score;
		};

		return [...results].sort((a, b) => scoreItem(b) - scoreItem(a));
	}, [results, debounced]);

	const movies = scored.filter((r) => r.media_type === "movie");
	const tv = scored.filter((r) => r.media_type === "tv");
	const people = scored.filter((r) => r.media_type === "person");

	const topResult = scored[0] ?? null;

	/* --------------------------------------------------
	   RECENT SEARCHES
	-------------------------------------------------- */
	const [recent, setRecent] = useState<string[]>(() => {
		const saved = localStorage.getItem("recentSearches");
		return saved ? JSON.parse(saved) : [];
	});

	const addRecent = (term: string) => {
		const t = term.trim();
		if (!t) return;
		const next = [t, ...recent.filter((r) => r !== t)].slice(0, 10);
		setRecent(next);
		localStorage.setItem("recentSearches", JSON.stringify(next));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		addRecent(query);
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-background pt-20 pb-10"
		>
			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<h1 className="text-3xl font-semibold text-foreground mb-4">Search</h1>

				<form onSubmit={handleSubmit} className="relative max-w-2xl mb-4">
					<input
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						placeholder="Search movies, TV shows, and people…"
						className="w-full rounded-lg border border-token bg-surface px-4 py-3 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
					/>
					{query && (
						<button
							type="button"
							onClick={() => setQuery("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-muted hover:text-foreground"
						>
							×
						</button>
					)}
				</form>

				{/* Recent + AI Suggestions */}
				<div className="grid gap-4 md:grid-cols-2 mb-6">
					{recent.length > 0 && (
						<Surface>
							<SectionHeader title="Recent searches" />
							<div className="flex flex-wrap gap-2">
								{recent.map((r) => (
									<button
										key={r}
										type="button"
										onClick={() => setQuery(r)}
										className="rounded-full border border-token px-3 py-1 text-xs text-muted hover:text-foreground hover:bg-surface-alt"
									>
										{r}
									</button>
								))}
							</div>
						</Surface>
					)}

					{suggestions.length > 0 && (
						<Surface>
							<SectionHeader title="Suggestions" eyebrow="AI-style ideas" />
							<div className="flex flex-col gap-2 text-sm">
								{suggestions.map((s) => (
									<button
										key={s.id}
										type="button"
										onClick={() => setQuery(s.query)}
										className="text-left text-accent hover:text-accent-soft"
									>
										{s.label}
									</button>
								))}
							</div>
						</Surface>
					)}
				</div>

				{/* Status */}
				{loading && <p className="text-sm text-muted mb-4">Searching TMDB…</p>}
				{error && <p className="text-sm text-red-400 mb-4">{error}</p>}
				{!loading && !error && debounced && scored.length === 0 && (
					<p className="text-sm text-muted mb-4">
						No results found for “{debounced}”.
					</p>
				)}

				{/* TOP RESULT */}
				{topResult && (
					<Surface className="mb-8">
						<SectionHeader title="Top result" eyebrow="Best match" />
						<Link
							to={
								topResult.media_type === "movie"
									? `/movie/${topResult.id}`
									: topResult.media_type === "tv"
									? `/tv/${topResult.id}`
									: `/person/${topResult.id}`
							}
							onMouseEnter={() => preload(topResult)}
							className="block rounded-lg border border-token bg-surface-alt p-4 hover:bg-surface transition"
						>
							<h2 className="text-lg font-semibold text-foreground">
								{topResult.title || topResult.name}
							</h2>
							<p className="text-xs text-muted mt-1 uppercase tracking-[0.2em]">
								{topResult.media_type}
							</p>
							{topResult.overview && (
								<p className="mt-2 text-sm text-muted line-clamp-3">
									{topResult.overview}
								</p>
							)}
						</Link>
					</Surface>
				)}

				{/* MOVIES */}
				{movies.length > 0 && (
					<Surface className="mb-8">
						<SectionHeader title="Movies" />
						<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
							{movies.map((m) => (
								<MovieCard key={m.id} movie={m as any} mediaType="movie" />
							))}
						</div>
					</Surface>
				)}

				{/* TV SHOWS */}
				{tv.length > 0 && (
					<Surface className="mb-8">
						<SectionHeader title="TV Shows" />
						<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
							{tv.map((t) => (
								<Link
									key={t.id}
									to={`/tv/${t.id}`}
									onMouseEnter={() => preload(t)}
									className="rounded-xl border border-token bg-surface p-3 hover:bg-surface-alt transition"
								>
									<p className="font-semibold text-sm text-foreground line-clamp-2">
										{t.name || t.title}
									</p>
									<p className="text-xs text-muted mt-1">
										{t.first_air_date?.split("-")[0] ??
											t.release_date?.split("-")[0] ??
											"—"}
									</p>
								</Link>
							))}
						</div>
					</Surface>
				)}

				{/* PEOPLE */}
				{people.length > 0 && (
					<Surface className="mb-8">
						<SectionHeader title="People" />
						<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
							{people.map((p) => (
								<Link
									key={p.id}
									to={`/person/${p.id}`}
									onMouseEnter={() => preload(p)}
									className="rounded-xl border border-token bg-surface p-3 hover:bg-surface-alt transition"
								>
									<p className="font-semibold text-sm text-foreground line-clamp-2">
										{p.name}
									</p>
									{p.known_for_department && (
										<p className="text-xs text-muted mt-1">
											Known for: {p.known_for_department}
										</p>
									)}
								</Link>
							))}
						</div>
					</Surface>
				)}
			</section>
		</motion.div>
	);
}
