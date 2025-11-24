// src/pages/person/PersonDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

import type { Person, CombinedCredits } from "../../types/Person";
import type { ImagesResponse } from "../../types/Shared";

import {
	getPerson,
	getPersonCombinedCredits,
	getPersonImages,
} from "../../services/api";

import Surface from "../../components/ui/Surface";
import SectionHeader from "../../components/ui/SectionHeader";
import PersonActingTimeline from "../../components/media/PersonActingTimeline";
import ParallaxHero, {
	type HeroSlide,
} from "../../components/layout/ParallaxHero";
import ImageGallery from "../../components/media/ImageGallery";

export default function PersonDetails() {
	/* -----------------------------------------------------
	   HOOKS / STATE
	----------------------------------------------------- */
	const { id } = useParams();
	const personId = Number(id);

	const [person, setPerson] = useState<Person | null>(null);
	const [credits, setCredits] = useState<CombinedCredits | null>(null);
	const [images, setImages] = useState<ImagesResponse | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	/* -----------------------------------------------------
	   LOAD PERSON + CREDITS + IMAGES
	----------------------------------------------------- */
	useEffect(() => {
		if (!personId) return;

		let cancelled = false;

		const load = async () => {
			setLoading(true);
			setError(null);

			try {
				const [personRes, creditsRes, imagesRes] = await Promise.all([
					getPerson(personId),
					getPersonCombinedCredits(personId),
					getPersonImages(personId),
				]);

				if (cancelled) return;

				setPerson(personRes);
				setCredits(creditsRes);
				setImages(imagesRes);
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error
							? err.message
							: "Failed to load person details."
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
	}, [personId]);

	/* -----------------------------------------------------
	   MEMO: HERO SLIDES
	   Preferred → known_for posters
	   Fallback  → profile image
	   Fallback  → /no-image.png
	----------------------------------------------------- */
	const heroSlides: HeroSlide[] = useMemo(() => {
		if (!person) return [];

		const castCredits = credits?.cast ?? [];

		const knownForWithPosters = castCredits
			.filter((c) => c.poster_path)
			.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
			.slice(0, 5);

		if (knownForWithPosters.length > 0) {
			return knownForWithPosters.map((c, idx) => ({
				id: `kf-${c.id}-${idx}`,
				backdropUrl: `https://image.tmdb.org/t/p/original${c.poster_path}`,
				title: person.name,
				overview: person.biography,
				mediaType: c.media_type,
				extra: c,
			}));
		}

		const profileBackdrop = person.profile_path
			? `https://image.tmdb.org/t/p/original${person.profile_path}`
			: "/no-image.png";

		return [
			{
				id: person.id,
				backdropUrl: profileBackdrop,
				title: person.name,
				overview: person.biography,
				mediaType: "person",
			},
		];
	}, [person, credits]);

	/* -----------------------------------------------------
	   MEMO: IMAGE GALLERY GROUPS (HYBRID)
	   - Profiles (from /person/{id}/images)
	   - Known For (from combined credits posters)
	----------------------------------------------------- */
	const imageGroups = useMemo(() => {
		if (!person) return [];

		const groups: {
			id: string;
			label: string;
			images: { url: string; alt: string }[];
		}[] = [];

		const profiles = images?.profiles ?? [];
		if (profiles.length > 0) {
			groups.push({
				id: "profiles",
				label: "Profiles",
				images: profiles.map((img) => ({
					url: `https://image.tmdb.org/t/p/w300${img.file_path}`,
					alt: `${person.name} profile`,
				})),
			});
		}

		const castCredits = credits?.cast ?? [];
		const knownForPosters = castCredits
			.filter((c) => c.poster_path)
			.sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
			.slice(0, 16);

		if (knownForPosters.length > 0) {
			groups.push({
				id: "known_for",
				label: "Known For",
				images: knownForPosters.map((c) => ({
					url: `https://image.tmdb.org/t/p/w342${c.poster_path}`,
					alt: c.title || c.name || "Known for",
				})),
			});
		}

		return groups;
	}, [person, images, credits]);

	/* -----------------------------------------------------
	   RENDER GUARDS
	----------------------------------------------------- */
	if (!id || Number.isNaN(personId)) {
		return (
			<div className="pt-5 text-center text-muted">Invalid person ID.</div>
		);
	}

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
		return (
			<div className="pt-5 text-center text-muted">
				No person data available.
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
						{/* Poster-style profile */}
						<div className="hidden w-40 shrink-0 overflow-hidden rounded-xl border border-token bg-surface-alt shadow-hero sm:block md:w-52 lg:w-50">
							<img
								src={
									person.profile_path
										? `https://image.tmdb.org/t/p/w500${person.profile_path}`
										: "/no-image.png"
								}
								alt={person.name}
								className="h-full w-full object-cover"
							/>
						</div>

						{/* Title & Overview */}
						<div className="flex flex-1 flex-col gap-4">
							<h1 className="text-balance text-4xl font-semibold tracking-tight text-foreground lg:text-5xl">
								{person.name}
							</h1>

							{person.known_for_department && (
								<p className="text-sm font-medium uppercase tracking-wide text-muted">
									{person.known_for_department}
								</p>
							)}

							{person.biography && (
								<p className="max-w-3xl text-sm text-muted line-clamp-[10]">
									{person.biography}
								</p>
							)}
						</div>
					</div>
				)}
			</ParallaxHero>

			{/* MAIN CONTENT */}
			<section className="mx-auto mt-8 max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
				{/* Row 1: Facts + “Highlights” (50/50 grid like Movie/TV Facts/Providers) */}
				<div className="grid gap-6 lg:grid-cols-2">
					{/* FACTS */}
					<Surface>
						<SectionHeader title="Details" eyebrow="Facts" />
						<div className="grid grid-cols-1 gap-3 text-sm text-muted sm:grid-cols-2">
							{person.birthday && (
								<p>
									<span className="font-medium text-foreground">Born: </span>
									{person.birthday}
								</p>
							)}
							{person.deathday && (
								<p>
									<span className="font-medium text-foreground">Died: </span>
									{person.deathday}
								</p>
							)}
							{person.place_of_birth && (
								<p>
									<span className="font-medium text-foreground">
										Place of Birth:{" "}
									</span>
									{person.place_of_birth}
								</p>
							)}
							{person.known_for_department && (
								<p>
									<span className="font-medium text-foreground">
										Known For:{" "}
									</span>
									{person.known_for_department}
								</p>
							)}
							{person.popularity != null && (
								<p>
									<span className="font-medium text-foreground">
										Popularity:{" "}
									</span>
									{Math.round(person.popularity)}
								</p>
							)}
							{person.also_known_as && person.also_known_as.length > 0 && (
								<p className="sm:col-span-2">
									<span className="font-medium text-foreground">
										Also known as:{" "}
									</span>
									{person.also_known_as.join(", ")}
								</p>
							)}
						</div>
					</Surface>

					{/* “HIGHLIGHTS” – using combined credits summary to mirror Providers card slot */}
					<Surface>
						<SectionHeader title="Highlights" eyebrow="Career" />
						<div className="space-y-3 text-sm text-muted">
							{credits && (
								<>
									<p>
										<span className="font-medium text-foreground">
											Cast credits:{" "}
										</span>
										{credits.cast.length}
									</p>
									<p>
										<span className="font-medium text-foreground">
											Crew credits:{" "}
										</span>
										{credits.crew.length}
									</p>
								</>
							)}
							{credits?.cast?.length > 0 && (
								<p className="text-xs text-muted">
									Top roles are highlighted in the timeline below.
								</p>
							)}
						</div>
					</Surface>
				</div>

				{/* Row 2: Images (full width, hybrid gallery) */}
				{imageGroups.length > 0 && (
					<Surface>
						<SectionHeader title="Images" eyebrow="Gallery" />
						<ImageGallery groups={imageGroups} />
					</Surface>
				)}

				{/* Row 3: Acting timeline / credits */}
				{credits && (
					<Surface>
						<SectionHeader title="Credits" eyebrow="Filmography" />
						<PersonActingTimeline credits={credits} />
					</Surface>
				)}
			</section>
		</motion.div>
	);
}
