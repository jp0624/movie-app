// src/pages/person/PersonDetails.tsx
import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import { useTmdbResource } from "../../hooks/useTmdbResource";
import { getPerson, getPersonImages } from "../../services/api";

import Surface from "../../components/ui/Surface";
import SectionHeader from "../../components/ui/SectionHeader";
import PersonActingTimeline from "../../components/media/info/PersonActingTimeline";
import ImageGallery from "../../components/media/info/ImageGallery";
import type { HeroSlide } from "../../components/layout/Hero/ParallaxHero";

import ParallaxHero from "../../components/layout/Hero/ParallaxHero";

export default function PersonDetails() {
	const { id } = useParams();
	const personId = Number(id);

	/* ----------------- DRY API ----------------- */
	const {
		data: person,
		loading,
		error,
	} = useTmdbResource(() => getPerson(personId));
	const { data: credits } = useTmdbResource(() => getPersonCredits(personId));
	const { data: images } = useTmdbResource(() => getPersonImages(personId));

	/* ----------------- HERO ----------------- */
	const heroSlides: HeroSlide[] = useMemo(() => {
		if (!person) return [];

		return [
			{
				id: person.id,
				backdropUrl: person.profile_path
					? `https://image.tmdb.org/t/p/original${person.profile_path}`
					: "/no-image.png",
				title: person.name,
				overview: person.biography,
				mediaType: "person",
			},
		];
	}, [person]);

	/* ----------------- STATES ----------------- */
	if (loading && !person) {
		return <div className="pt-5 text-center text-muted">Loading person…</div>;
	}
	if (error && !person) {
		return (
			<div className="pt-5 text-center text-red-400">
				Failed to load person: {error}
			</div>
		);
	}
	if (!person) {
		return <div className="pt-5 text-center text-muted">Person not found.</div>;
	}

	const personImages = images?.profiles ?? [];

	/* ----------------- RENDER ----------------- */
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
							{person.name}
						</h1>
						{person.biography && (
							<p className="max-w-3xl text-sm text-muted">{person.biography}</p>
						)}
					</div>
				)}
			</ParallaxHero>

			<section className="mx-auto mt-8 max-w-7xl px-4 space-y-6">
				{/* IMAGE GALLERY */}
				{personImages.length > 0 && (
					<Surface>
						<SectionHeader title="Images" eyebrow="Gallery" />
						<ImageGallery profiles={personImages} />
					</Surface>
				)}

				{/* ACTING TIMELINE */}
				{credits?.cast?.length > 0 && (
					<Surface>
						<SectionHeader title="Acting Career" eyebrow="Filmography" />
						<PersonActingTimeline cast={credits.cast} />
					</Surface>
				)}
			</section>
		</motion.div>
	);
}
