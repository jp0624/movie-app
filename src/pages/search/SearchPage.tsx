// src/pages/search/SearchPage.tsx
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import SearchCard from "../../components/media/SearchCard";
import { searchMulti } from "../../services/api";

interface MultiResult {
	id: number;
	media_type?: "movie" | "tv" | "person";
	title?: string;
	name?: string;
	poster_path?: string | null;
	profile_path?: string | null;
	known_for_department?: string;
}

interface MultiResponse {
	page: number;
	results: MultiResult[];
	total_pages: number;
	total_results: number;
}

export default function SearchPage() {
	const [searchParams, setSearchParams] = useSearchParams();
	const initialQuery = searchParams.get("q") ?? "";

	const [query, setQuery] = useState(initialQuery);
	const [results, setResults] = useState<MultiResult[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!query.trim()) {
			setResults([]);
			setError(null);
			return;
		}

		let cancelled = false;

		const load = async () => {
			setLoading(true);
			setError(null);
			try {
				const data = (await searchMulti(query, 1)) as MultiResponse;
				if (cancelled) return;
				setResults(data.results ?? []);
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error ? err.message : "Failed to load search results"
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
	}, [query]);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setSearchParams(query ? { q: query } : {});
	};

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="px-4 py-6 bg-page min-h-screen text-foreground"
		>
			<section className="mx-auto max-w-5xl">
				<motion.h1
					initial={{ y: 24, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
					className="text-3xl font-semibold tracking-tight mb-4"
				>
					Search across TMDB
				</motion.h1>

				<form onSubmit={handleSubmit} className="mb-6">
					<div className="relative">
						<input
							className="w-full rounded-lg border border-token bg-surface px-4 py-3 pr-10 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent"
							placeholder="Search movies, TV shows, and people…"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
						/>
						{query && (
							<button
								type="button"
								onClick={() => setQuery("")}
								className="absolute right-3 top-1/2 -translate-y-1/2 text-lg text-muted hover:text-foreground"
								aria-label="Clear search"
							>
								×
							</button>
						)}
					</div>
				</form>

				{loading && (
					<p className="text-sm text-muted">Searching for “{query}”…</p>
				)}
				{error && <p className="text-sm text-red-400">Error: {error}</p>}
				{!loading && !error && query && results.length === 0 && (
					<p className="text-sm text-muted">No results found for “{query}”.</p>
				)}

				{results.length > 0 && (
					<div className="mt-4 grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
						{results.map((r) => (
							<SearchCard key={`${r.media_type ?? "m"}-${r.id}`} result={r} />
						))}
					</div>
				)}
			</section>
		</motion.div>
	);
}
