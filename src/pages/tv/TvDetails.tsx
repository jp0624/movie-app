// src/pages/tv/TvDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import type { TvShow } from "../../types/Tv";
import type {
	CreditsResponse,
	VideosResponse,
	ReviewsResponse,
	WatchProvidersResponse,
	ImagesResponse,
} from "../../types/Shared";

import {
	getTv,
	getTvCredits,
	getTvVideos,
	getTvReviews,
	getTvRecommendations,
	getTvWatchProviders,
	getTvImages,
} from "../../services/api";

import Surface from "../../components/ui/Surface";
import SectionHeader from "../../components/ui/SectionHeader";
import CastCarousel from "../../components/media/CastCarousel";
import TrailerCarousel from "../../components/media/TrailerCarousel";
import RecommendationsRow from "../../components/media/RecommendationsRow";
import ReviewsList from "../../components/media/ReviewsList";
import SeasonCarousel from "../../components/media/SeasonCarousel";
import ImageGallery from "../../components/media/ImageGallery";

import ParallaxHero, {
	type HeroSlide,
} from "../../components/layout/ParallaxHero";

export default function TvDetails() {
	/* -----------------------------------------------------
	   HOOKS — STABLE ORDER
	----------------------------------------------------- */
	const { id } = useParams();
	const tvId = Number(id);

	const [show, setShow] = useState<TvShow | null>(null);
	const [credits, setCredits] = useState<CreditsResponse | null>(null);
	const [videos, setVideos] = useState<VideosResponse | null>(null);
	const [reviews, setReviews] = useState<ReviewsResponse | null>(null);
	const [providers, setProviders] = useState<WatchProvidersResponse | null>(
		null
	);
	const [recommendations, setRecommendations] = useState<TvShow[]>([]);
	const [images, setImages] = useState<ImagesResponse | null>(null);

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	/* -----------------------------------------------------
	   LOAD TV DETAILS
	----------------------------------------------------- */
	useEffect(() => {
		if (!tvId) return;
		let cancelled = false;

		const load = async () => {
			setLoading(true);
			setError(null);

			try {
				const [
					showRes,
					creditsRes,
					videosRes,
					reviewsRes,
					recsRes,
					providersRes,
					imagesRes,
				] = await Promise.all([
					getTv(tvId),
					getTvCredits(tvId),
					getTvVideos(tvId),
					getTvReviews(tvId),
					getTvRecommendations(tvId),
					getTvWatchProviders(tvId),
					getTvImages(tvId),
				]);

				if (cancelled) return;

				setShow(showRes);
				setCredits(creditsRes);
				setVideos(videosRes);
				setReviews(reviewsRes);
				setProviders(providersRes);
				setRecommendations(recsRes.results ?? []);
				setImages(imagesRes);
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error ? err.message : "Failed to load TV details."
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
	}, [tvId]);

	/* -----------------------------------------------------
	   MEMO-DERIVED DATA
	----------------------------------------------------- */
	const cast = credits?.cast ?? [];
	const topCast = cast.slice(0, 12);

	const videosList = videos?.results ?? [];
	const trailerVideos = videosList.filter(
		(v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
	);

	const countryProviders =
		providers?.results?.["CA"] ?? providers?.results?.["US"];

	const year = show?.first_air_date?.split("-")[0] ?? "";

	const backdropImages = images?.backdrops ?? [];
	const posterImages = images?.posters ?? [];
	const logoImages = images?.logos ?? [];

	const heroSlides: HeroSlide[] = useMemo(() => {
		if (!show) return [];

		// Prefer top 5 backdrops if we have them
		if (backdropImages.length > 0) {
			return backdropImages.slice(0, 5).map((b, idx) => ({
				id: `bd-${idx}`,
				backdropUrl: `https://image.tmdb.org/t/p/original${b.file_path}`,
				title: show.name,
				year,
				overview: show.overview,
				score: show.vote_average ?? null,
				mediaType: "tv",
				link: `/tv/${show.id}`,
			}));
		}

		// Fallback: single hero from show backdrop/poster
		return [
			{
				id: show.id,
				backdropUrl: show.backdrop_path
					? `https://image.tmdb.org/t/p/original${show.backdrop_path}`
					: show.poster_path
					? `https://image.tmdb.org/t/p/original${show.poster_path}`
					: "/no-image.png",
				title: show.name,
				year,
				overview: show.overview,
				score: show.vote_average ?? null,
				mediaType: "tv",
				link: `/tv/${show.id}`,
			},
		];
	}, [show, year, backdropImages]);

	/* -----------------------------------------------------
	   RENDER GUARDS
	----------------------------------------------------- */
	if (!id || Number.isNaN(tvId)) {
		return <div className="pt-5 text-center text-muted">Invalid TV ID.</div>;
	}

	if (loading && !show) {
		return <div className="pt-5 text-center text-muted">Loading TV show…</div>;
	}

	if (error && !show) {
		return (
			<div className="pt-5 text-center text-red-400">
				Failed to load TV show: {error}
			</div>
		);
	}

	if (!show) {
		return (
			<div className="pt-5 text-center text-muted">
				No TV show data available.
			</div>
		);
	}

	/* -----------------------------------------------------
	   MAIN RENDER
	----------------------------------------------------- */
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-background pt-5 pb-10"
		>
			{/* HERO */}
			<ParallaxHero slides={heroSlides}>
				{() => (
					<div className="flex flex-col gap-5 sm:flex-row sm:gap-6">
						{/* Poster */}
						<div className="hidden w-40 shrink-0 overflow-hidden rounded-xl border border-token bg-surface-alt shadow-hero sm:block md:w-52 lg:w-50">
							<img
								src={
									show.poster_path
										? `https://image.tmdb.org/t/p/w500${show.poster_path}`
										: "/no-image.png"
								}
								alt={show.name}
								className="h-full w-full object-cover"
							/>
						</div>

						{/* Title & Overview */}
						<div className="flex flex-1 flex-col gap-4">
							<h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
								{show.name}
								{year && (
									<span className="ml-2 text-2xl font-normal text-muted">
										({year})
									</span>
								)}
							</h1>

							{show.tagline && (
								<p className="text-sm font-medium italic text-muted">
									{show.tagline}
								</p>
							)}

							{show.overview && (
								<p className="max-w-3xl text-sm text-muted">{show.overview}</p>
							)}
						</div>
					</div>
				)}
			</ParallaxHero>

			{/* MAIN CONTENT GRID */}
			<section className="mx-auto mt-8 max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
				{/* Row 1: Facts + Providers (50/50 desktop, stacked mobile) */}
				<div className="grid gap-6 lg:grid-cols-2">
					{/* FACTS */}
					<Surface>
						<SectionHeader title="Details" eyebrow="Facts" />
						<div className="grid gap-3 text-sm text-muted sm:grid-cols-2">
							{show.status && (
								<div>
									<span className="font-medium text-foreground">Status: </span>
									{show.status}
								</div>
							)}
							{show.first_air_date && (
								<div>
									<span className="font-medium text-foreground">
										First Air Date:{" "}
									</span>
									{show.first_air_date}
								</div>
							)}
							{show.last_air_date && (
								<div>
									<span className="font-medium text-foreground">
										Last Air Date:{" "}
									</span>
									{show.last_air_date}
								</div>
							)}
							{show.number_of_episodes != null && (
								<div>
									<span className="font-medium text-foreground">
										Episodes:{" "}
									</span>
									{show.number_of_episodes}
								</div>
							)}
							{show.number_of_seasons != null && (
								<div>
									<span className="font-medium text-foreground">Seasons: </span>
									{show.number_of_seasons}
								</div>
							)}
							{show.genres && show.genres.length > 0 && (
								<div>
									<span className="font-medium text-foreground">Genres: </span>
									{show.genres.map((g) => g.name).join(", ")}
								</div>
							)}
							{show.popularity != null && (
								<div>
									<span className="font-medium text-foreground">
										Popularity:{" "}
									</span>
									{Math.round(show.popularity)}
								</div>
							)}
							{show.original_language && (
								<div>
									<span className="font-medium text-foreground">
										Original Language:{" "}
									</span>
									{show.original_language.toUpperCase()}
								</div>
							)}
							{show.homepage && (
								<div className="sm:col-span-2">
									<span className="font-medium text-foreground">Website: </span>
									<a
										href={show.homepage}
										target="_blank"
										rel="noreferrer"
										className="text-accent hover:underline"
									>
										Official Site
									</a>
								</div>
							)}
						</div>
					</Surface>

					{/* PROVIDERS */}
					<Surface>
						<SectionHeader title="Where to Watch" eyebrow="Providers" />
						{countryProviders ? (
							<div className="space-y-3 text-sm text-muted">
								{countryProviders.flatrate && (
									<div>
										<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
											Streaming
										</p>
										<div className="flex flex-wrap gap-2">
											{countryProviders.flatrate.map((p) => (
												<div
													key={p.provider_id}
													className="flex items-center gap-2 rounded-full bg-surface-alt px-2 py-1 text-xs"
												>
													{p.logo_path && (
														<img
															src={`https://image.tmdb.org/t/p/w45${p.logo_path}`}
															alt={p.provider_name}
															className="h-5 w-5 rounded"
														/>
													)}
													<span>{p.provider_name}</span>
												</div>
											))}
										</div>
									</div>
								)}
								{countryProviders.rent && (
									<div>
										<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
											Rent
										</p>
										<div className="flex flex-wrap gap-2">
											{countryProviders.rent.map((p) => (
												<span
													key={p.provider_id}
													className="rounded-full bg-surface-alt px-2 py-1 text-xs"
												>
													{p.provider_name}
												</span>
											))}
										</div>
									</div>
								)}
								{countryProviders.buy && (
									<div>
										<p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">
											Buy
										</p>
										<div className="flex flex-wrap gap-2">
											{countryProviders.buy.map((p) => (
												<span
													key={p.provider_id}
													className="rounded-full bg-surface-alt px-2 py-1 text-xs"
												>
													{p.provider_name}
												</span>
											))}
										</div>
									</div>
								)}
							</div>
						) : (
							<p className="text-sm text-muted">No provider data available.</p>
						)}
					</Surface>
				</div>

				{/* Row 2: Seasons (full width) */}
				{show.seasons && show.seasons.length > 0 && (
					<Surface>
						<SectionHeader title="Seasons" eyebrow="Episodes" />
						<SeasonCarousel seasons={show.seasons} tvId={tvId} />
					</Surface>
				)}

				{/* Row 2.5: Images (full width, hybrid gallery) */}
				{backdropImages.length > 0 ||
				posterImages.length > 0 ||
				logoImages.length > 0 ? (
					<Surface>
						<SectionHeader title="Images" eyebrow="Gallery" />
						<ImageGallery
							backdrops={backdropImages}
							posters={posterImages}
							logos={logoImages}
						/>
					</Surface>
				) : null}

				{/* Row 3: Cast */}
				{topCast.length > 0 && (
					<Surface>
						<SectionHeader title="Series Cast" eyebrow="Cast" />
						<CastCarousel cast={topCast} />
					</Surface>
				)}

				{/* Row 4: Videos */}
				{trailerVideos.length > 0 && (
					<Surface>
						<SectionHeader title="Videos" eyebrow="Trailers & Clips" />
						<TrailerCarousel videos={trailerVideos} />
					</Surface>
				)}

				{/* Row 5: Reviews */}
				{reviews && reviews.results && reviews.results.length > 0 && (
					<Surface>
						<SectionHeader
							title="User Reviews"
							eyebrow="What people are saying"
						/>
						<ReviewsList reviews={reviews.results.slice(0, 4)} />
					</Surface>
				)}
			</section>

			{/* Row 6: Recommendations */}
			{recommendations.length > 0 && (
				<section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
					<Surface>
						<SectionHeader
							title="You May Also Like"
							eyebrow="Recommendations"
						/>
						<RecommendationsRow items={recommendations} mediaType="tv" />
					</Surface>
				</section>
			)}
		</motion.div>
	);
}
