// src/pages/tv/EpisodeDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import type { Episode } from "../../types/Tv";
import type {
	VideosResponse,
	CreditsResponse,
	ImagesResponse,
} from "../../types/Shared";

import {
	getTvEpisode,
	getTvEpisodeVideos,
	getTvCredits,
	getTvEpisodeImages,
} from "../../services/api";

import Surface from "../../components/ui/Surface";
import SectionHeader from "../../components/ui/SectionHeader";
import CastCarousel from "../../components/media/CastCarousel";
import TrailerCarousel from "../../components/media/TrailerCarousel";
import ImageGallery from "../../components/media/ImageGallery";

import ParallaxHero, {
	type HeroSlide,
} from "../../components/layout/ParallaxHero";

export default function EpisodeDetails() {
	const { id, seasonNumber, episodeNumber } = useParams();
	const tvId = Number(id);
	const s = Number(seasonNumber);
	const e = Number(episodeNumber);

	const [episode, setEpisode] = useState<Episode | null>(null);
	const [credits, setCredits] = useState<CreditsResponse | null>(null);
	const [videos, setVideos] = useState<VideosResponse | null>(null);
	const [images, setImages] = useState<ImagesResponse | null>(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!tvId || !s || !e) return;

		let cancelled = false;

		const load = async () => {
			setLoading(true);

			try {
				const [epRes, creditsRes, videosRes, imagesRes] = await Promise.all([
					getTvEpisode(tvId, s, e),
					getTvCredits(tvId),
					getTvEpisodeVideos(tvId, s, e),
					getTvEpisodeImages(tvId, s, e),
				]);

				if (cancelled) return;

				setEpisode(epRes);
				setCredits(creditsRes);
				setVideos(videosRes);
				setImages(imagesRes);
			} catch (err) {
				if (!cancelled) setError("Failed to load episode.");
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		load();
		return () => {
			cancelled = true;
		};
	}, [tvId, s, e]);

	/* HERO */
	const heroSlides: HeroSlide[] = useMemo(() => {
		if (!episode) return [];

		const stills = images?.stills ?? [];

		if (stills.length > 0) {
			return stills.slice(0, 5).map((img, idx) => ({
				id: `st-${idx}`,
				backdropUrl: `https://image.tmdb.org/t/p/original${img.file_path}`,
				title: episode.name,
				overview: episode.overview,
				mediaType: "episode",
			}));
		}

		return [
			{
				id: episode.id,
				backdropUrl: episode.still_path
					? `https://image.tmdb.org/t/p/original${episode.still_path}`
					: "/no-image.png",
				title: episode.name,
				overview: episode.overview,
				mediaType: "episode",
			},
		];
	}, [episode, images]);

	/* CAST */
	const topCast = credits?.cast.slice(0, 12) ?? [];
	const guestStars = episode?.guest_stars ?? [];

	if (loading)
		return <div className="pt-5 text-center text-muted">Loading episode…</div>;
	if (error || !episode)
		return <div className="pt-5 text-center text-red-400">{error}</div>;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-background pt-5 pb-10"
		>
			<ParallaxHero slides={heroSlides}>
				{() => (
					<div className="flex flex-col gap-4">
						<h1 className="text-4xl font-semibold text-foreground">
							{episode.name}
						</h1>
						{episode.overview && (
							<p className="max-w-3xl text-sm text-muted">{episode.overview}</p>
						)}
					</div>
				)}
			</ParallaxHero>

			<section className="mx-auto mt-8 max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
				{/* Images */}
				{images && (
					<Surface>
						<SectionHeader title="Images" eyebrow="Gallery" />
						<ImageGallery images={images} />
					</Surface>
				)}

				{/* Cast */}
				{topCast.length > 0 && (
					<Surface>
						<SectionHeader title="Cast" eyebrow="Main Cast" />
						<CastCarousel cast={topCast} />
					</Surface>
				)}

				{/* Guest Stars */}
				{guestStars.length > 0 && (
					<Surface>
						<SectionHeader
							title="Guest Stars"
							eyebrow="Appears In This Episode"
						/>
						<CastCarousel cast={guestStars} />
					</Surface>
				)}

				{/* Videos */}
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
