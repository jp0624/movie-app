// src/pages/Movie/MovieDetails.tsx
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { useTmdbResource } from "../../hooks/useTmdbResource";

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
import CastCarousel from "../../components/media/carousels/CastCarousel";
import TrailerCarousel from "../../components/media/carousels/TrailerCarousel";
import RecommendationsCarousel from "../../components/media/carousels/RecommendationsCarousel";
import ReviewList from "../../components/media/lists/ReviewList";
import ImageGallery from "../../components/media/info/ImageGallery";
import WatchProviders from "../../components/media/info/WatchProviders";

import MovieHero from "./MovieHero";

export default function MovieDetails() {
	const { id } = useParams();
	const movieId = Number(id);

	const {
		data: movie,
		loading,
		error,
	} = useTmdbResource(() => getMovie(movieId), [movieId]);

	const { data: credits } = useTmdbResource(
		() => getMovieCredits(movieId),
		[movieId]
	);

	const { data: videos } = useTmdbResource(
		() => getMovieVideos(movieId),
		[movieId]
	);

	const { data: reviews } = useTmdbResource(
		() => getMovieReviews(movieId),
		[movieId]
	);

	const { data: recs } = useTmdbResource(
		() => getMovieRecommendations(movieId),
		[movieId]
	);

	const { data: providers } = useTmdbResource(
		() => getMovieWatchProviders(movieId),
		[movieId]
	);

	const { data: images } = useTmdbResource(
		() => getMovieImages(movieId),
		[movieId]
	);

	if (loading && !movie)
		return <div className="pt-10 text-center text-muted">Loading…</div>;
	if (error || !movie)
		return (
			<div className="pt-10 text-center text-red-400">Movie not found.</div>
		);

	const cast = credits?.cast ?? [];
	const trailers =
		videos?.results?.filter(
			(v: any) =>
				v.site === "YouTube" && (v.type === "Trailer" || v.type === "Teaser")
		) ?? [];

	const recommendations = recs?.results ?? [];

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="min-h-screen bg-background pb-10"
		>
			<MovieHero movie={movie} images={images} />

			<section className="mx-auto max-w-7xl px-4 mt-10 space-y-10">
				<Surface>
					<SectionHeader title="Details" eyebrow="Facts" />
					<div className="grid gap-4 sm:grid-cols-2 text-sm text-muted">
						{movie.release_date && (
							<p>
								<span className="font-medium text-foreground">Release: </span>
								{movie.release_date}
							</p>
						)}
						{movie.runtime && (
							<p>
								<span className="font-medium text-foreground">Runtime: </span>
								{movie.runtime} min
							</p>
						)}
						{movie.genres && (
							<p>
								<span className="font-medium text-foreground">Genres: </span>
								{movie.genres.map((g: any) => g.name).join(", ")}
							</p>
						)}
					</div>
				</Surface>

				{images && (
					<Surface>
						<SectionHeader title="Images" eyebrow="Gallery" />
						<ImageGallery
							backdrops={images.backdrops ?? []}
							posters={images.posters ?? []}
							logos={images.logos ?? []}
						/>
					</Surface>
				)}

				{cast.length > 0 && (
					<Surface>
						<SectionHeader title="Cast" eyebrow="Stars" />
						<CastCarousel cast={cast.slice(0, 20)} />
					</Surface>
				)}

				{trailers.length > 0 && (
					<Surface>
						<SectionHeader title="Videos" eyebrow="Trailers" />
						<TrailerCarousel videos={trailers} />
					</Surface>
				)}

				{reviews?.results?.length > 0 && (
					<Surface>
						<SectionHeader title="User Reviews" eyebrow="Reviews" />
						<ReviewList reviews={reviews.results.slice(0, 4)} />
					</Surface>
				)}

				{recommendations.length > 0 && (
					<Surface>
						<SectionHeader title="You May Also Like" eyebrow="More Like This" />
						<RecommendationsCarousel
							items={recommendations}
							mediaType="movie"
						/>
					</Surface>
				)}
			</section>
		</motion.div>
	);
}
