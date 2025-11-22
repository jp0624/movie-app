// src/pages/tv/EpisodeDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

import type { Episode } from "../../types/Tv";
import type { VideosResponse } from "../../types/Shared";

import {
	getTv,
	getTvSeason,
	getTvEpisode,
	getTvEpisodeVideos,
} from "../../services/api";

import Surface from "../../components/ui/Surface";
import SectionHeader from "../../components/ui/SectionHeader";
import TrailerCarousel from "../../components/media/TrailerCarousel";

interface RouteParams {
	id?: string;
	seasonNumber?: string;
	episodeNumber?: string;
}

export default function EpisodeDetails() {
	const { id, seasonNumber, episodeNumber } = useParams<RouteParams>();

	const showId = Number(id);
	const sNum = Number(seasonNumber);
	const eNum = Number(episodeNumber);

	const [episode, setEpisode] = useState<Episode | null>(null);
	const [showName, setShowName] = useState("");
	const [videos, setVideos] = useState<VideosResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!showId || !sNum || !eNum) return;

		let cancelled = false;

		const load = async () => {
			setLoading(true);
			setError(null);

			try {
				const [show, season, episodeRes, videosRes] = await Promise.all([
					getTv(showId),
					getTvSeason(showId, sNum),
					getTvEpisode(showId, sNum, eNum),
					getTvEpisodeVideos(showId, sNum, eNum),
				]);

				if (cancelled) return;

				setShowName(show.name);
				setEpisode(episodeRes);
				setVideos(videosRes);
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error
							? err.message
							: "Failed to load episode details"
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
	}, [showId, sNum, eNum]);

	const trailerVideos = useMemo(
		() =>
			(videos?.results ?? []).filter(
				(v) =>
					v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
			),
		[videos]
	);

	if (loading && !episode) {
		return <div className="py-10 text-muted text-center">Loading episode…</div>;
	}

	if (error && !episode) {
		return (
			<div className="py-10 text-center text-red-400">Failed: {error}</div>
		);
	}

	if (!episode) return null;

	const still = episode.still_path
		? `https://image.tmdb.org/t/p/original${episode.still_path}`
		: "/no-image.png";

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="pb-10"
		>
			{/* HERO */}
			<section className="relative -mx-4 mb-8 sm:mx-0">
				<div
					className="absolute inset-0 opacity-30 bg-cover bg-center"
					style={{ backgroundImage: `url(${still})` }}
				/>
				<div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

				<div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
					<Link
						to={`/tv/${showId}/season/${sNum}`}
						className="text-accent text-xs hover:underline"
					>
						← Back to Season {sNum}
					</Link>

					<h1 className="mt-3 text-3xl font-semibold text-foreground">
						{showName} — S{sNum}E{eNum}: {episode.name}
					</h1>

					<p className="text-muted mt-2 text-sm max-w-xl">{episode.overview}</p>
				</div>
			</section>

			{/* TRAILERS */}
			{trailerVideos.length > 0 && (
				<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<Surface>
						<SectionHeader title="Episode Videos" eyebrow="Trailers & Clips" />
						<TrailerCarousel videos={trailerVideos} />
					</Surface>
				</section>
			)}
		</motion.div>
	);
}
