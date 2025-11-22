// src/pages/tv/SeasonDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";

import type { TvShow, Season, Episode } from "../../types/Tv";
import { getTv, getTvSeason } from "../../services/api";

import Surface from "../../components/ui/Surface";
import SectionHeader from "../../components/ui/SectionHeader";
import EpisodeCard from "../../components/media/EpisodeCard";
import SeasonCarousel from "../../components/media/SeasonCarousel";

interface RouteParams {
	id?: string;
	seasonNumber?: string;
}

export default function SeasonDetails() {
	const { id, seasonNumber } = useParams<RouteParams>();
	const showId = Number(id);
	const seasonNum = Number(seasonNumber);
	const navigate = useNavigate();

	const [show, setShow] = useState<TvShow | null>(null);
	const [season, setSeason] = useState<Season | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!showId || !seasonNum) return;

		let cancelled = false;

		const load = async () => {
			setLoading(true);
			setError(null);

			try {
				const [showRes, seasonRes] = await Promise.all([
					getTv(showId),
					getTvSeason(showId, seasonNum),
				]);

				if (cancelled) return;

				setShow(showRes);
				setSeason(seasonRes);
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error ? err.message : "Failed to load season details"
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
	}, [showId, seasonNum]);

	// PRE-COMPUTED VALUES
	const heroPoster = season?.poster_path
		? `https://image.tmdb.org/t/p/w500${season.poster_path}`
		: "/no-image.png";

	const episodes: Episode[] = season?.episodes ?? [];

	const sortedSeasons = useMemo(() => {
		return show?.seasons
			? [...show.seasons].sort((a, b) => a.season_number - b.season_number)
			: [];
	}, [show]);

	const handleSwitchSeason = (num: number) => {
		navigate(`/tv/${showId}/season/${num}`);
	};

	// RENDER STATES
	if (!id || Number.isNaN(showId)) {
		return (
			<div className="py-10 text-center text-muted">Invalid TV show ID.</div>
		);
	}

	if (loading && !season) {
		return (
			<div className="py-10 text-center text-muted">
				Loading season details…
			</div>
		);
	}

	if (error && !season) {
		return (
			<div className="py-10 text-center text-red-400">Failed: {error}</div>
		);
	}

	if (!season || !show) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="pb-10"
		>
			{/* HERO */}
			<section className="relative -mx-4 mb-6 sm:mx-0">
				<div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 flex gap-6">
					{/* Poster */}
					<div className="hidden sm:block w-40 md:w-52">
						<img
							src={heroPoster}
							alt={season.name}
							className="rounded-xl shadow-card border border-token object-cover"
						/>
					</div>

					{/* Text content */}
					<div className="flex flex-col gap-3 flex-1">
						<Link
							to={`/tv/${showId}`}
							className="text-accent text-xs hover:underline"
						>
							← Back to {show.name}
						</Link>

						<h1 className="text-3xl font-semibold text-foreground">
							{season.name}
						</h1>

						<div className="text-muted text-sm">
							{season.air_date && (
								<p>
									Aired:{" "}
									<span className="text-foreground">{season.air_date}</span>
								</p>
							)}
							{season.episode_count && <p>{season.episode_count} episodes</p>}
						</div>

						{season.overview && (
							<p className="text-sm text-muted max-w-2xl">{season.overview}</p>
						)}
					</div>
				</div>
			</section>

			{/* SWITCH SEASONS */}
			{sortedSeasons.length > 0 && (
				<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-6">
					<Surface>
						<SectionHeader title="Switch Season" eyebrow="All seasons" />
						<SeasonCarousel
							seasons={sortedSeasons}
							activeSeason={seasonNum}
							onSeasonChange={handleSwitchSeason}
						/>
					</Surface>
				</section>
			)}

			{/* EPISODES */}
			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<Surface>
					<SectionHeader title="Episodes" eyebrow="Season breakdown" />
					<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
						{episodes.map((ep) => (
							<EpisodeCard
								key={ep.id}
								episode={ep}
								showId={showId}
								seasonNumber={seasonNum}
							/>
						))}
					</div>
				</Surface>
			</section>
		</motion.div>
	);
}
