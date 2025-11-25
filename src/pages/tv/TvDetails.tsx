// src/pages/Tv/TvDetails.tsx
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { useTmdbResource } from "../../hooks/useTmdbResource";

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
import CastCarousel from "../../components/media/carousels/CastCarousel";
import TrailerCarousel from "../../components/media/carousels/TrailerCarousel";
import RecommendationsCarousel from "../../components/media/carousels/RecommendationsCarousel";
import ReviewList from "../../components/media/lists/ReviewList";
import ImageGallery from "../../components/media/info/ImageGallery";
import WatchProviders from "../../components/media/info/WatchProviders";
import SeasonCarousel from "../../components/media/carousels/SeasonCarousel";

import TvHero from "./TvHero";

export default function TvDetails() {
	const { id } = useParams();
	const tvId = Number(id);

	const {
		data: show,
		loading,
		error,
	} = useTmdbResource(() => getTv(tvId), [tvId]);
	const { data: credits } = useTmdbResource(() => getTvCredits(tvId), [tvId]);
	const { data: videos } = useTmdbResource(() => getTvVideos(tvId), [tvId]);
	const { data: reviews } = useTmdbResource(() => getTvReviews(tvId), [tvId]);
	const { data: recs } = useTmdbResource(
		() => getTvRecommendations(tvId),
		[tvId]
	);
	const { data: providers } = useTmdbResource(
		() => getTvWatchProviders(tvId),
		[tvId]
	);
	const { data: images } = useTmdbResource(() => getTvImages(tvId), [tvId]);

	if (loading && !show)
		return <div className="pt-10 text-center text-muted">Loading…</div>;
	if (error || !show)
		return (
			<div className="pt-10 text-center text-red-400">TV show not found.</div>
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
			<TvHero show={show} images={images} />

			<section className="mx-auto max-w-7xl px-4 mt-10 space-y-10">
				<Surface>
					<SectionHeader title="Series Info" eyebrow="Facts" />
					<div className="grid gap-4 sm:grid-cols-2 text-sm text-muted">
						{show.first_air_date && (
							<p>
								<span className="font-medium text-foreground">First Air: </span>
								{show.first_air_date}
							</p>
						)}
						{show.last_air_date && (
							<p>
								<span className="font-medium text-foreground">Last Air: </span>
								{show.last_air_date}
							</p>
						)}
						{show.genres?.length > 0 && (
							<p>
								<span className="font-medium text-foreground">Genres: </span>
								{show.genres.map((g: any) => g.name).join(", ")}
							</p>
						)}
					</div>
				</Surface>

				{show.seasons?.length > 0 && (
					<Surface>
						<SectionHeader title="Seasons" eyebrow="Episodes" />
						<SeasonCarousel seasons={show.seasons} tvId={tvId} />
					</Surface>
				)}

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
						<SectionHeader title="Cast" eyebrow="Main Cast" />
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
						<SectionHeader title="Reviews" eyebrow="What People Say" />
						<ReviewList reviews={reviews.results.slice(0, 4)} />
					</Surface>
				)}

				{recommendations.length > 0 && (
					<Surface>
						<SectionHeader title="You May Also Like" eyebrow="More Like This" />
						<RecommendationsCarousel items={recommendations} mediaType="tv" />
					</Surface>
				)}
			</section>
		</motion.div>
	);
}
