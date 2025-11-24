// src/pages/tv/SeasonDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

import type { Season, Episode } from "../../types/Tv";
import type { CreditsResponse, ImagesResponse } from "../../types/Shared";

import {
	getTv,
	getTvSeason,
	getTvCredits,
	getTvSeasonImages,
} from "../../services/api";

import Surface from "../../components/ui/Surface";
import SectionHeader from "../../components/ui/SectionHeader";
import CastCarousel from "../../components/media/CastCarousel";
import EpisodeCard from "../../components/media/EpisodeCard";
import ImageGallery from "../../components/media/ImageGallery";

import ParallaxHero, {
	type HeroSlide,
} from "../../components/layout/ParallaxHero";

export default function SeasonDetails() {
	const { id, seasonNumber } = useParams();
	const tvId = Number(id);
	const seasonNum = Number(seasonNumber);

	const [season, setSeason] = useState<Season | null>(null);
	const [show, setShow] = useState<any | null>(null);
	const [credits, setCredits] = useState<CreditsResponse | null>(null);
	const [images, setImages] = useState<ImagesResponse | null>(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!tvId || !seasonNum) return;
		let cancelled = false;

		const load = async () => {
			setLoading(true);

			try {
				const [showRes, seasonRes, creditsRes, imagesRes] = await Promise.all([
					getTv(tvId),
					getTvSeason(tvId, seasonNum),
					getTvCredits(tvId),
					getTvSeasonImages(tvId, seasonNum),
				]);

				if (cancelled) return;

				setShow(showRes);
				setSeason(seasonRes);
				setCredits(creditsRes);
				setImages(imagesRes);
			} catch (err) {
				if (!cancelled) {
					setError("Failed to load season details.");
				}
			} finally {
				if (!cancelled) setLoading(false);
			}
		};

		load();
		return () => {
			cancelled = true;
		};
	}, [tvId, seasonNum]);

	/* -----------------------------
	   HERO SLIDES
	----------------------------- */
	const heroSlides: HeroSlide[] = useMemo(() => {
		if (!season) return [];

		const stills = images?.posters ?? [];

		if (stills.length > 0) {
			return stills.slice(0, 5).map((s, idx) => ({
				id: `st-${idx}`,
				backdropUrl: `https://image.tmdb.org/t/p/original${s.file_path}`,
				title: season.name,
				overview: season.overview,
				mediaType: "season",
			}));
		}

		// fallback
		return [
			{
				id: season.id,
				backdropUrl: season.poster_path
					? `https://image.tmdb.org/t/p/original${season.poster_path}`
					: "/no-image.png",
				title: season.name,
				overview: season.overview,
				mediaType: "season",
			},
		];
	}, [season, images]);

	/* -----------------------------
	   CAST + GUEST STARS
	----------------------------- */

	const topCast = credits?.cast.slice(0, 12) ?? [];

	const guestStars = useMemo(() => {
		if (!season?.episodes) return [];
		return season.episodes.flatMap((ep) => ep.guest_stars ?? []);
	}, [season]);

	/* -----------------------------
	   RENDERING
	----------------------------- */

	if (loading)
		return <div className="pt-5 text-center text-muted">Loading season…</div>;
	if (error || !season || !show)
		return <div className="pt-5 text-center text-red-400">{error}</div>;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-background pt-5 pb-10"
		>
			{/* HERO */}
			<ParallaxHero slides={heroSlides}>
				{() => (
					<div className="flex flex-col gap-4">
						<h1 className="text-4xl font-semibold text-foreground">
							{show.name} — {season.name}
						</h1>

						{season.overview && (
							<p className="max-w-3xl text-sm text-muted">{season.overview}</p>
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
						<SectionHeader title="Season Cast" eyebrow="Cast" />
						<CastCarousel cast={topCast} />
					</Surface>
				)}

				{/* Guest Stars */}
				{guestStars.length > 0 && (
					<Surface>
						<SectionHeader title="Guest Stars" eyebrow="Episodes" />
						<CastCarousel cast={guestStars} />
					</Surface>
				)}

				{/* Episodes */}
				{season.episodes && season.episodes.length > 0 && (
					<Surface>
						<SectionHeader title="Episodes" eyebrow={`Season ${seasonNum}`} />
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
							{season.episodes.map((ep) => (
								<Link
									key={ep.id}
									to={`/tv/${tvId}/season/${seasonNum}/episode/${ep.episode_number}`}
								>
									<EpisodeCard episode={ep} />
								</Link>
							))}
						</div>
					</Surface>
				)}
			</section>
		</motion.div>
	);
}
