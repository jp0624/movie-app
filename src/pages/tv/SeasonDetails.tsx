// src/pages/tv/SeasonDetails.tsx
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import type { Season, Episode } from "../../types/Tv";
import type { CreditsResponse, ImagesResponse } from "../../types/Shared";

import {
	getTv,
	getTvSeason,
	getTvCredits,
	getTvSeasonImages,
} from "../../services/api";

import { useTmdbResource } from "../../hooks/useTmdbResource";
import { tmdbBackdrop, tmdbPoster } from "../../utils/tmdbImage";

import Surface from "../../components/ui/Surface";
import SectionHeader from "../../components/ui/SectionHeader";
import CastCarousel from "../../components/media/CastCarousel";
import EpisodeCard from "../../components/media/cards/EpisodeCard";
import ImageGallery from "../../components/media/info/ImageGallery";
import ParallaxHero, {
	type HeroSlide,
} from "../../components/layout/Hero/ParallaxHero";

const EPISODES_PAGE_SIZE = 20;

export default function SeasonDetails() {
	const { id, seasonNumber } = useParams();
	const tvId = Number(id);
	const seasonNum = Number(seasonNumber);

	/* ----------------------------------------------------
	   FETCH — Cached TMDB Requests
	---------------------------------------------------- */
	const {
		data: show,
		loading: showLoading,
		error: showError,
	} = useTmdbResource(() => getTv(tvId), [tvId]);

	const {
		data: season,
		loading: seasonLoading,
		error: seasonError,
	} = useTmdbResource<Season>(
		() => getTvSeason(tvId, seasonNum),
		[tvId, seasonNum]
	);

	const { data: credits } = useTmdbResource<CreditsResponse>(
		() => getTvCredits(tvId),
		[tvId]
	);

	const { data: images } = useTmdbResource<ImagesResponse>(
		() => getTvSeasonImages(tvId, seasonNum),
		[tvId, seasonNum]
	);

	/* ----------------------------------------------------
	   HERO SLIDES
	---------------------------------------------------- */
	const heroSlides: HeroSlide[] = useMemo(() => {
		if (!show || !season) return [];

		const backdrops = images?.backdrops ?? [];

		if (backdrops.length > 0) {
			return backdrops.slice(0, 5).map((b, idx) => ({
				id: `season-bd-${idx}`,
				backdropUrl: tmdbBackdrop(b.file_path, "lg"),
				title: `${show.name} — ${season.name}`,
				overview: season.overview || show.overview,
				year: season.air_date?.split("-")[0] ?? "",
				score: show.vote_average ?? null,
				mediaType: "tv",
			}));
		}

		return [
			{
				id: `${show.id}-season-${season.season_number}`,
				backdropUrl: tmdbBackdrop(
					season.poster_path || show.backdrop_path || show.poster_path,
					"lg"
				),
				title: `${show.name} — ${season.name}`,
				overview: season.overview || show.overview,
				year: season.air_date?.split("-")[0] ?? "",
				score: show.vote_average ?? null,
				mediaType: "tv",
			},
		];
	}, [show, season, images]);

	/* ----------------------------------------------------
	   EPISODES — progressive loading
	---------------------------------------------------- */
	const episodes: Episode[] = season?.episodes ?? [];
	const [visibleCount, setVisibleCount] = useState(EPISODES_PAGE_SIZE);

	const visibleEpisodes = useMemo(
		() => episodes.slice(0, visibleCount),
		[episodes, visibleCount]
	);

	const canShowMore = visibleCount < episodes.length;

	/* ----------------------------------------------------
	   CAST
	---------------------------------------------------- */
	const mainCast = credits?.cast?.slice(0, 16) ?? [];

	/* ----------------------------------------------------
	   LOADING & ERROR STATES
	---------------------------------------------------- */
	if (!id || Number.isNaN(tvId) || Number.isNaN(seasonNum)) {
		return (
			<div className="pt-5 text-center text-muted">Invalid season URL.</div>
		);
	}

	if ((showLoading || seasonLoading) && !show && !season) {
		return (
			<div className="pt-5 text-center text-muted">Loading season details…</div>
		);
	}

	if ((showError || seasonError) && (!show || !season)) {
		return (
			<div className="pt-5 text-center text-red-400">
				Failed to load season: {showError || seasonError}
			</div>
		);
	}

	if (!show || !season) {
		return (
			<div className="pt-5 text-center text-muted">
				Season not found or unavailable.
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
			{/* HERO */}
			{heroSlides.length > 0 && (
				<ParallaxHero slides={heroSlides}>
					{() => (
						<div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
							{/* Season poster */}
							<div className="hidden w-40 md:w-52 overflow-hidden rounded-xl border border-token sm:block">
								<img
									src={tmdbPoster(season.poster_path ?? show.poster_path, "md")}
									loading="lazy"
									decoding="async"
									alt={season.name}
									className="h-full w-full object-cover"
								/>
							</div>

							<div className="flex flex-col gap-3">
								<h1 className="text-3xl font-semibold text-foreground sm:text-4xl">
									{show.name}{" "}
									<span className="text-muted text-2xl">— {season.name}</span>
								</h1>
								{season.air_date && (
									<p className="text-sm text-muted">
										Premiered: {season.air_date}
									</p>
								)}
								{season.overview && (
									<p className="max-w-3xl text-sm text-muted">
										{season.overview}
									</p>
								)}
							</div>
						</div>
					)}
				</ParallaxHero>
			)}

			<section className="mx-auto mt-8 max-w-7xl px-4 space-y-6">
				{/* DETAILS + IMAGES */}
				<div className="grid gap-6 lg:grid-cols-2">
					<Surface>
						<SectionHeader title="Season Details" eyebrow="Overview" />
						<div className="grid gap-3 text-sm text-muted sm:grid-cols-2">
							{season.air_date && (
								<div>
									<span className="font-medium text-foreground">Air Date:</span>{" "}
									{season.air_date}
								</div>
							)}
							{season.episode_count != null && (
								<div>
									<span className="font-medium text-foreground">Episodes:</span>{" "}
									{season.episode_count}
								</div>
							)}
							{show.number_of_seasons != null && (
								<div>
									<span className="font-medium text-foreground">
										Total Seasons:
									</span>{" "}
									{show.number_of_seasons}
								</div>
							)}
						</div>
					</Surface>

					{(images?.backdrops?.length ||
						images?.posters?.length ||
						images?.stills?.length) && (
						<Surface>
							<SectionHeader title="Season Images" eyebrow="Gallery" />
							<ImageGallery
								backdrops={images?.backdrops ?? []}
								posters={images?.posters ?? []}
								logos={images?.stills ?? []}
							/>
						</Surface>
					)}
				</div>

				{/* EPISODES */}
				{episodes.length > 0 && (
					<Surface>
						<SectionHeader title="Episodes" eyebrow="Season episodes" />
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							{visibleEpisodes.map((ep) => (
								<EpisodeCard
									key={ep.id}
									showId={tvId}
									seasonNumber={seasonNum}
									episode={ep}
								/>
							))}
						</div>

						{canShowMore && (
							<div className="mt-4 text-center">
								<button
									type="button"
									onClick={() =>
										setVisibleCount((prev) =>
											Math.min(prev + EPISODES_PAGE_SIZE, episodes.length)
										)
									}
									className="inline-flex items-center rounded-full border border-token bg-surface px-4 py-2 text-xs font-semibold text-foreground hover:bg-surface-alt"
								>
									Show more episodes ({episodes.length - visibleCount}{" "}
									remaining)
								</button>
							</div>
						)}
					</Surface>
				)}

				{/* CAST */}
				{mainCast.length > 0 && (
					<Surface>
						<SectionHeader title="Series Cast" eyebrow="Main cast" />
						<CastCarousel cast={mainCast} />
					</Surface>
				)}
			</section>
		</motion.div>
	);
}
