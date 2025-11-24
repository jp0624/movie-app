// src/pages/movie/MovieDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import type { Movie } from "../../types/Movie";
import type {
	CreditsResponse,
	VideosResponse,
	ReviewsResponse,
	WatchProvidersResponse,
	ImagesResponse,
} from "../../types/Shared";

import {
	getMovie,
	getMovieCredits,
	getMovieVideos,
	getMovieReviews,
	getMovieRecommendations,
	getMovieWatchProviders,
	getMovieImages,
} from "../../services/api";

import Surface from "../../components/ui/Surface";
import SectionHeader from "../../components/ui/SectionHeader";
import CastCarousel from "../../components/media/CastCarousel";
import TrailerCarousel from "../../components/media/TrailerCarousel";
import RecommendationsRow from "../../components/media/RecommendationsRow";
import ReviewsList from "../../components/media/ReviewsList";
import ImageGallery from "../../components/media/ImageGallery";

import ParallaxHero, {
	type HeroSlide,
} from "../../components/layout/ParallaxHero";

export default function MovieDetails() {
	/* -----------------------------------------------------
	   HOOKS — MUST ALWAYS RUN
	----------------------------------------------------- */
	const { id } = useParams();
	const movieId = Number(id);

	const [movie, setMovie] = useState<Movie | null>(null);
	const [credits, setCredits] = useState<CreditsResponse | null>(null);
	const [videos, setVideos] = useState<VideosResponse | null>(null);
	const [reviews, setReviews] = useState<ReviewsResponse | null>(null);
	const [providers, setProviders] = useState<WatchProvidersResponse | null>(
		null
	);
	const [recommendations, setRecommendations] = useState<Movie[]>([]);
	const [images, setImages] = useState<ImagesResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	/* -----------------------------------------------------
	   LOAD DATA
	----------------------------------------------------- */
	useEffect(() => {
		if (!movieId) return;

		let cancelled = false;

		const load = async () => {
			setLoading(true);
			setError(null);

			try {
				const [
					movieRes,
					creditsRes,
					videosRes,
					reviewsRes,
					recsRes,
					providersRes,
					imagesRes,
				] = await Promise.all([
					getMovie(movieId),
					getMovieCredits(movieId),
					getMovieVideos(movieId),
					getMovieReviews(movieId),
					getMovieRecommendations(movieId),
					getMovieWatchProviders(movieId),
					getMovieImages(movieId),
				]);

				if (cancelled) return;

				setMovie(movieRes);
				setCredits(creditsRes);
				setVideos(videosRes);
				setReviews(reviewsRes);
				setProviders(providersRes);
				setRecommendations(recsRes.results ?? []);
				setImages(imagesRes);
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error ? err.message : "Failed to load movie details."
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
	}, [movieId]);

	/* -----------------------------------------------------
	   MEMO DATA
	----------------------------------------------------- */
	const cast = credits?.cast ?? [];
	const topCast = cast.slice(0, 12);

	const videosList = videos?.results ?? [];
	const trailerVideos = videosList.filter(
		(v) => v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
	);

	const countryProviders =
		providers?.results?.["CA"] ?? providers?.results?.["US"];

	const year = movie?.release_date?.split("-")[0] ?? "";

	const runtimeText = useMemo(() => {
		if (!movie?.runtime) return "";
		const total = movie.runtime;
		const hours = Math.floor(total / 60);
		const mins = total % 60;
		if (!hours) return `${mins} min`;
		if (!mins) return `${hours}h`;
		return `${hours}h ${mins}m`;
	}, [movie?.runtime]);

	const backdropImages = images?.backdrops ?? [];
	const posterImages = images?.posters ?? [];
	const logoImages = images?.logos ?? [];

	const heroSlides: HeroSlide[] = useMemo(() => {
		if (!movie) return [];

		const backdropUrl = movie.backdrop_path
			? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
			: movie.poster_path
			? `https://image.tmdb.org/t/p/original${movie.poster_path}`
			: "/no-image.png";

		const posterUrl = movie.poster_path
			? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
			: "/no-image.png";

		return [
			{
				id: movie.id,
				backdropUrl,
				posterUrl,
				title: movie.title,
				year,
				overview: movie.overview,
				score: movie.vote_average ?? null,
				mediaType: "movie",
				link: `/movie/${movie.id}`,
			},
		];
	}, [movie, year]);

	/* -----------------------------------------------------
	   GUARDS
	----------------------------------------------------- */

	if (!id || Number.isNaN(movieId)) {
		return <div className="pt-5 text-center text-muted">Invalid movie ID.</div>;
	}

	if (loading && !movie) {
		return (
			<div className="pt-5 text-center text-muted">Loading movie details…</div>
		);
	}

	if (error && !movie) {
		return (
			<div className="pt-5 text-center text-red-400">
				Failed to load movie: {error}
			</div>
		);
	}

	if (!movie) {
		return (
			<div className="pt-5 text-center text-muted">
				No movie data available.
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
					<div className="flex flex-col gap-5 sm:flex-row sm:items-stretch sm:gap-6">
						{/* Poster */}
						<div className="hidden w-40 shrink-0 overflow-hidden rounded-xl border border-token bg-surface-alt shadow-hero sm:block md:w-52 lg:w-50">
							<img
								src={
									movie.poster_path
										? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
										: "/no-image.png"
								}
								alt={movie.title}
								className="h-full w-full object-cover"
							/>
						</div>

						{/* Title + Text */}
						<div className="flex flex-1 flex-col gap-4">
							<h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
								{movie.title}
								{year && (
									<span className="ml-2 text-2xl font-normal text-muted">
										({year})
									</span>
								)}
							</h1>

							{movie.tagline && (
								<p className="text-sm font-medium italic text-muted">
									{movie.tagline}
								</p>
							)}

							{movie.overview && (
								<p className="max-w-3xl text-sm text-muted">{movie.overview}</p>
							)}
						</div>
					</div>
				)}
			</ParallaxHero>

			{/* MAIN CONTENT GRID */}
			<section className="mx-auto mt-8 max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
				{/* Row 1: Facts + Providers (50/50 desktop) */}
				<div className="grid gap-6 lg:grid-cols-2">
					{/* FACTS */}
					<Surface>
						<SectionHeader title="Details" eyebrow="Facts" />
						<div className="grid gap-3 text-sm text-muted sm:grid-cols-2">
							{movie.status && (
								<div>
									<span className="font-medium text-foreground">Status: </span>
									{movie.status}
								</div>
							)}
							{movie.release_date && (
								<div>
									<span className="font-medium text-foreground">
										Release Date:{" "}
									</span>
									{movie.release_date}
								</div>
							)}
							{runtimeText && (
								<div>
									<span className="font-medium text-foreground">Runtime: </span>
									{runtimeText}
								</div>
							)}
							{movie.genres && movie.genres.length > 0 && (
								<div>
									<span className="font-medium text-foreground">Genres: </span>
									{movie.genres.map((g) => g.name).join(", ")}
								</div>
							)}
							{movie.popularity != null && (
								<div>
									<span className="font-medium text-foreground">
										Popularity:{" "}
									</span>
									{Math.round(movie.popularity)}
								</div>
							)}
							{movie.original_language && (
								<div>
									<span className="font-medium text-foreground">
										Original Language:{" "}
									</span>
									{movie.original_language.toUpperCase()}
								</div>
							)}
							{movie.homepage && (
								<div className="sm:col-span-2">
									<span className="font-medium text-foreground">Website: </span>
									<a
										href={movie.homepage}
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

					{/* WHERE TO WATCH */}
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

				{/* Row 2.5: Images */}
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
						<SectionHeader title="Top Billed Cast" eyebrow="Cast" />
						<CastCarousel cast={topCast} />
					</Surface>
				)}

				{/* Row 4: Trailers */}
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
							title="Social & Reviews"
							eyebrow="What people are saying"
						/>
						<ReviewsList reviews={reviews.results.slice(0, 4)} />
					</Surface>
				)}
			</section>

			{/* RECOMMENDATIONS */}
			{recommendations.length > 0 && (
				<section className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-8">
					<Surface>
						<SectionHeader
							title="You May Also Like"
							eyebrow="Recommendations"
						/>
						<RecommendationsRow items={recommendations} mediaType="movie" />
					</Surface>
				</section>
			)}
		</motion.div>
	);
}
