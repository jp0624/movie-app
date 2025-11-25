// src/pages/tv/EpisodeDetails.tsx
import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

import type { Episode, Season } from "../../types/Tv";
import type {
	VideosResponse,
	CreditsResponse,
	ImagesResponse,
} from "../../types/Shared";

import {
	getTvEpisode,
	getTvEpisodeVideos,
	getTvEpisodeImages,
	getTvSeason,
	getTvCredits,
} from "../../services/api";

import { useTmdbResource } from "../../hooks/useTmdbResource";
import { useTmdbPreload } from "../../hooks/useTmdbPreload";
import { tmdbBackdrop } from "../../utils/tmdbImage";

import Surface from "../../components/ui/Surface";
import SectionHeader from "../../components/ui/SectionHeader";
import CastCarousel from "../../components/media/CastCarousel";
import TrailerCarousel from "../../components/media/carousels/TrailerCarousel";
import ImageGallery from "../../components/media/info/ImageGallery";

export default function EpisodeDetails() {
	const { id, seasonNumber, episodeNumber } = useParams();
	const tvId = Number(id);
	const seasonNum = Number(seasonNumber);
	const episodeNum = Number(episodeNumber);

	/* ----------------------------------------------------
	   FETCH — Cached TMDB Requests
	---------------------------------------------------- */
	const {
		data: episode,
		loading,
		error,
	} = useTmdbResource<Episode>(
		() => getTvEpisode(tvId, seasonNum, episodeNum),
		[tvId, seasonNum, episodeNum]
	);

	const { data: videos } = useTmdbResource<VideosResponse>(
		() => getTvEpisodeVideos(tvId, seasonNum, episodeNum),
		[tvId, seasonNum, episodeNum]
	);

	const { data: images } = useTmdbResource<ImagesResponse>(
		() => getTvEpisodeImages(tvId, seasonNum, episodeNum),
		[tvId, seasonNum, episodeNum]
	);

	const { data: season } = useTmdbResource<Season>(
		() => getTvSeason(tvId, seasonNum),
		[tvId, seasonNum]
	);

	const { data: credits } = useTmdbResource<CreditsResponse>(
		() => getTvCredits(tvId),
		[tvId]
	);

	/* ----------------------------------------------------
	   NEIGHBOR EPISODES
	---------------------------------------------------- */
	const { prevEpisode, nextEpisode } = useMemo(() => {
		if (!season?.episodes) return { prevEpisode: null, nextEpisode: null };
		const idx = season.episodes.findIndex(
			(e) => e.episode_number === episodeNum
		);
		if (idx === -1) return { prevEpisode: null, nextEpisode: null };

		const prevEpisode = idx > 0 ? season.episodes[idx - 1] : null;
		const nextEpisode =
			idx < season.episodes.length - 1 ? season.episodes[idx + 1] : null;
		return { prevEpisode, nextEpisode };
	}, [season, episodeNum]);

	const preloadPrev = useTmdbPreload(() =>
		prevEpisode
			? getTvEpisode(
					tvId,
					prevEpisode.season_number,
					prevEpisode.episode_number
			  )
			: Promise.resolve()
	);

	const preloadNext = useTmdbPreload(() =>
		nextEpisode
			? getTvEpisode(
					tvId,
					nextEpisode.season_number,
					nextEpisode.episode_number
			  )
			: Promise.resolve()
	);

	/* ----------------------------------------------------
	   DERIVED DATA
	---------------------------------------------------- */
	const mainCast = credits?.cast?.slice(0, 16) ?? [];

	const backdropImage =
		images?.stills?.[0]?.file_path ??
		images?.backdrops?.[0]?.file_path ??
		episode?.still_path ??
		null;

	const backdropUrl = tmdbBackdrop(backdropImage, "lg");

	/* ----------------------------------------------------
	   LOADING / ERROR
	---------------------------------------------------- */
	if (
		!id ||
		Number.isNaN(tvId) ||
		Number.isNaN(seasonNum) ||
		Number.isNaN(episodeNum)
	) {
		return (
			<div className="pt-5 text-center text-muted">Invalid episode URL.</div>
		);
	}

	if (loading && !episode) {
		return <div className="pt-5 text-center text-muted">Loading episode…</div>;
	}

	if (error && !episode) {
		return (
			<div className="pt-5 text-center text-red-400">
				Failed to load episode: {error}
			</div>
		);
	}

	if (!episode) {
		return (
			<div className="pt-5 text-center text-muted">
				Episode not found or unavailable.
			</div>
		);
	}

	/* ----------------------------------------------------
	   RENDER
	---------------------------------------------------- */
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-background pt-5 pb-10"
		>
			{/* HERO STYLE HEADER */}
			<div className="relative mx-auto flex max-w-7xl flex-col gap-4 px-4 sm:px-6 lg:px-8">
				<div className="relative overflow-hidden rounded-xl border border-token bg-black">
					{backdropUrl && (
						<img
							src={backdropUrl}
							loading="lazy"
							decoding="async"
							alt={episode.name}
							className="h-60 w-full object-cover sm:h-72 md:h-80"
						/>
					)}
					<div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
					<div className="relative z-10 flex h-full flex-col justify-end p-4 sm:p-6">
						<p className="text-xs uppercase tracking-[0.2em] text-accent">
							Season {episode.season_number} · Episode {episode.episode_number}
						</p>
						<h1 className="mt-1 text-2xl font-semibold text-foreground sm:text-3xl md:text-4xl">
							{episode.name}
						</h1>
						{episode.air_date && (
							<p className="mt-1 text-xs text-muted">
								Aired {episode.air_date}
							</p>
						)}
					</div>
				</div>

				{/* NAV PREV / NEXT */}
				<div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted">
					<div className="flex gap-2">
						{prevEpisode && (
							<Link
								to={`/tv/${tvId}/season/${prevEpisode.season_number}/episode/${prevEpisode.episode_number}`}
								onMouseEnter={preloadPrev}
								className="inline-flex items-center rounded-full border border-token bg-surface px-3 py-1 hover:bg-surface-alt"
							>
								<span className="mr-1">←</span> Prev: {prevEpisode.name}
							</Link>
						)}
						{nextEpisode && (
							<Link
								to={`/tv/${tvId}/season/${nextEpisode.season_number}/episode/${nextEpisode.episode_number}`}
								onMouseEnter={preloadNext}
								className="inline-flex items-center rounded-full border border-token bg-surface px-3 py-1 hover:bg-surface-alt"
							>
								Next: {nextEpisode.name} <span className="ml-1">→</span>
							</Link>
						)}
					</div>
				</div>
			</div>

			<section className="mx-auto mt-6 max-w-7xl px-4 space-y-6">
				{/* OVERVIEW */}
				<Surface>
					<SectionHeader title="Overview" eyebrow="Episode details" />
					<div className="text-sm text-muted">
						{episode.overview || "No overview is available for this episode."}
					</div>
				</Surface>

				{/* IMAGES */}
				{(images?.stills?.length ||
					images?.backdrops?.length ||
					images?.posters?.length) && (
					<Surface>
						<SectionHeader title="Images" eyebrow="Gallery" />
						<ImageGallery
							backdrops={images?.backdrops ?? []}
							posters={images?.posters ?? []}
							logos={images?.stills ?? []}
						/>
					</Surface>
				)}

				{/* CAST */}
				{mainCast.length > 0 && (
					<Surface>
						<SectionHeader title="Series Cast" eyebrow="Cast" />
						<CastCarousel cast={mainCast} />
					</Surface>
				)}

				{/* VIDEOS */}
				{videos && videos.results.length > 0 && (
					<Surface>
						<SectionHeader title="Videos" eyebrow="Trailers & Clips" />
						<TrailerCarousel videos={videos.results} />
					</Surface>
				)}
			</section>
		</motion.div>
	);
}
