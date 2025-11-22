// src/pages/tv/TvDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import type { TvShow, Season } from "../../types/Tv";
import type {
	CreditsResponse,
	VideosResponse,
	ReviewsResponse,
	WatchProvidersResponse,
} from "../../types/Shared";

import {
	getTv,
	getTvCredits,
	getTvVideos,
	getTvReviews,
	getTvRecommendations,
	getTvWatchProviders,
} from "../../services/api";

import Surface from "../../components/ui/Surface";
import SectionHeader from "../../components/ui/SectionHeader";
import Badge from "../../components/ui/Badge";
import CastCarousel from "../../components/media/CastCarousel";
import TrailerCarousel from "../../components/media/TrailerCarousel";
import RecommendationsRow from "../../components/media/RecommendationsRow";
import SeasonCarousel from "../../components/media/SeasonCarousel";

interface RouteParams {
	id?: string;
}

export default function TvDetails() {
	const { id } = useParams<RouteParams>();
	const tvId = Number(id);
	const navigate = useNavigate();

	const [show, setShow] = useState<TvShow | null>(null);
	const [credits, setCredits] = useState<CreditsResponse | null>(null);
	const [videos, setVideos] = useState<VideosResponse | null>(null);
	const [reviews, setReviews] = useState<ReviewsResponse | null>(null);
	const [providers, setProviders] = useState<WatchProvidersResponse | null>(
		null
	);
	const [recommendations, setRecommendations] = useState<TvShow[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Non-hook derived values must come after hooks setup,
	// but before early returns. We'll calculate using show? everywhere.

	useEffect(() => {
		if (!tvId || Number.isNaN(tvId)) return;
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
				] = await Promise.all([
					getTv(tvId),
					getTvCredits(tvId),
					getTvVideos(tvId),
					getTvReviews(tvId),
					getTvRecommendations(tvId),
					getTvWatchProviders(tvId),
				]);

				if (cancelled) return;

				setShow(showRes);
				setCredits(creditsRes);
				setVideos(videosRes);
				setReviews(reviewsRes);
				setRecommendations(recsRes.results ?? []);
				setProviders(providersRes);
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error ? err.message : "Failed to load TV details"
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

	const cast = credits?.cast ?? [];
	const topCast = cast.slice(0, 12);
	const videosList = videos?.results ?? [];
	const trailerVideos = videosList.filter(
		(v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
	);
	const mainReviews = reviews?.results?.slice(0, 4) ?? [];

	const countryProviders =
		providers?.results?.["CA"] ?? providers?.results?.["US"];

	const seasons: Season[] = show?.seasons ?? [];
	const sortedSeasons = useMemo(
		() => [...seasons].sort((a, b) => a.season_number - b.season_number),
		[seasons]
	);

	const year = show?.first_air_date?.split("-")[0] ?? "";
	const score = show?.vote_average != null ? show.vote_average.toFixed(1) : "–";

	const heroBackdrop = useMemo(() => {
		if (!show) return "/no-image.png";
		if (show.backdrop_path) {
			return `https://image.tmdb.org/t/p/original${show.backdrop_path}`;
		}
		if (show.poster_path) {
			return `https://image.tmdb.org/t/p/w780${show.poster_path}`;
		}
		return "/no-image.png";
	}, [show]);

	const activeSeasonNumber =
		sortedSeasons.find((s) => s.season_number === show?.number_of_seasons)
			?.season_number || sortedSeasons[0]?.season_number;

	const handleSeasonChange = (seasonNumber: number) => {
		if (!show) return;
		navigate(`/tv/${show.id}/season/${seasonNumber}`);
	};

	if (!id || Number.isNaN(tvId)) {
		return (
			<div className="py-10 text-center text-muted">
				Invalid TV show ID in URL.
			</div>
		);
	}

	if (loading && !show) {
		return (
			<div className="py-10 text-center text-muted">
				Loading TV show details…
			</div>
		);
	}

	if (error && !show) {
		return (
			<div className="py-10 text-center text-red-400">
				Failed to load TV show: {error}
			</div>
		);
	}

	if (!show) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="pb-10"
		>
			{/* HERO */}
			<section className="relative -mx-4 mb-8 overflow-hidden bg-gradient-to-b from-background to-page sm:mx-0">
				<div className="absolute inset-0">
					<div
						className="h-full w-full bg-cover bg-center opacity-40"
						style={{ backgroundImage: `url(${heroBackdrop})` }}
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-page via-page/60 to-transparent" />
				</div>

				<div className="relative mx-auto flex max-w-7xl gap-6 px-4 pb-8 pt-16 sm:px-6 lg:px-8 lg:pb-10 lg:pt-20">
					{/* Poster */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className="hidden w-40 shrink-0 overflow-hidden rounded-xl border border-token bg-surface-alt shadow-hero sm:block md:w-52 lg:w-64"
					>
						<img
							src={
								show.poster_path
									? `https://image.tmdb.org/t/p/w500${show.poster_path}`
									: "/no-image.png"
							}
							alt={show.name}
							className="h-full w-full object-cover"
						/>
					</motion.div>

					{/* Text content */}
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6, delay: 0.1 }}
						className="relative flex flex-1 flex-col gap-4"
					>
						<div className="flex flex-wrap items-center gap-3">
							{show.tagline && (
								<span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
									{show.tagline}
								</span>
							)}
							{show.status && <Badge>{show.status}</Badge>}
						</div>

						<h1 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
							{show.name}
							{year && (
								<span className="ml-2 text-2xl font-normal text-muted">
									({year})
								</span>
							)}
						</h1>

						<div className="flex flex-wrap items-center gap-3 text-sm text-muted">
							{show.genres && show.genres.length > 0 && (
								<span>{show.genres.map((g) => g.name).join(" · ")}</span>
							)}
							{show.number_of_seasons != null &&
								show.number_of_episodes != null && (
									<>
										<span className="h-1 w-1 rounded-full bg-muted/60" />
										<span>
											{show.number_of_seasons} seasons ·{" "}
											{show.number_of_episodes} episodes
										</span>
									</>
								)}
						</div>

						<div className="mt-2 flex flex-wrap items-center gap-4 text-sm">
							<div className="flex items-center gap-2">
								<span className="flex h-9 w-9 items-center justify-center rounded-full bg-yellow-400/90 text-sm font-semibold text-black shadow-card">
									★
								</span>
								<div className="leading-tight">
									<p className="text-xs uppercase tracking-wide text-muted">
										User score
									</p>
									<p className="text-sm font-semibold text-foreground">
										{score} / 10
									</p>
								</div>
							</div>

							{show.homepage && (
								<a
									href={show.homepage}
									target="_blank"
									rel="noreferrer"
									className="text-xs font-medium text-accent hover:underline"
								>
									Official site →
								</a>
							)}
						</div>

						{show.overview && (
							<div className="mt-3 max-w-3xl text-sm text-muted">
								<p>{show.overview}</p>
							</div>
						)}
					</motion.div>
				</div>
			</section>

			<section className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,1.2fr)] lg:px-8">
				{/* Left column */}
				<div className="space-y-6">
					{/* Seasons */}
					{sortedSeasons.length > 0 && (
						<Surface>
							<SectionHeader title="Seasons" eyebrow="Episodes & arcs" />
							<SeasonCarousel
								seasons={sortedSeasons}
								activeSeason={activeSeasonNumber}
								onSeasonChange={handleSeasonChange}
							/>
						</Surface>
					)}

					{/* Cast */}
					{topCast.length > 0 && (
						<Surface>
							<SectionHeader
								title="Series Cast"
								eyebrow="Cast"
								actionSlot={
									cast.length > topCast.length ? (
										<span className="text-xs text-muted">
											Showing {topCast.length} of {cast.length}
										</span>
									) : null
								}
							/>
							<CastCarousel cast={topCast} />
						</Surface>
					)}

					{/* Trailers */}
					{trailerVideos.length > 0 && (
						<Surface>
							<SectionHeader title="Videos" eyebrow="Trailers & Clips" />
							<TrailerCarousel videos={trailerVideos} />
						</Surface>
					)}

					{/* Reviews */}
					{mainReviews.length > 0 && (
						<Surface>
							<SectionHeader
								title="Social & Reviews"
								eyebrow="What people are saying"
							/>
							<div className="space-y-4">
								{mainReviews.map((review) => (
									<div
										key={review.id}
										className="rounded-lg border border-token bg-surface-alt p-3 text-sm"
									>
										<div className="mb-1 flex items-center justify-between gap-2 text-xs text-muted">
											<span className="font-medium">
												{review.author_details.username ||
													review.author ||
													"Anonymous"}
											</span>
											{review.author_details.rating != null && (
												<span className="flex items-center gap-1">
													<span className="text-yellow-400 text-sm">★</span>
													{review.author_details.rating}/10
												</span>
											)}
										</div>
										<p className="line-clamp-4 text-sm text-foreground/90">
											{review.content}
										</p>
										<a
											href={review.url}
											target="_blank"
											rel="noreferrer"
											className="mt-2 inline-block text-xs text-accent hover:underline"
										>
											Read full review →
										</a>
									</div>
								))}
							</div>
						</Surface>
					)}
				</div>

				{/* Right column */}
				<div className="space-y-6">
					<Surface>
						<SectionHeader title="Facts" eyebrow="Details" />
						<div className="space-y-3 text-sm text-muted">
							{show.status && (
								<p>
									<span className="font-medium text-foreground">Status: </span>
									{show.status}
								</p>
							)}
							{show.first_air_date && (
								<p>
									<span className="font-medium text-foreground">
										First Air:{" "}
									</span>
									{show.first_air_date}
								</p>
							)}
							{show.last_air_date && (
								<p>
									<span className="font-medium text-foreground">
										Last Air:{" "}
									</span>
									{show.last_air_date}
								</p>
							)}
							{show.popularity != null && (
								<p>
									<span className="font-medium text-foreground">
										Popularity:{" "}
									</span>
									{Math.round(show.popularity)}
								</p>
							)}
						</div>
					</Surface>

					{countryProviders && (
						<Surface>
							<SectionHeader title="Where to Watch" eyebrow="Providers" />
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
						</Surface>
					)}
				</div>
			</section>

			{/* Recommendations */}
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
