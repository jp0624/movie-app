// src/pages/person/PersonDetails.tsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";

import type { Person } from "../../types/Person";
import type { CombinedCredits } from "../../types/Shared";

import { getPerson, getPersonCombinedCredits } from "../../services/api";

import Surface from "../../components/ui/Surface";
import SectionHeader from "../../components/ui/SectionHeader";
import PersonActingTimeline from "../../components/media/PersonActingTimeline";

interface RouteParams {
	id?: string;
}

export default function PersonDetails() {
	const { id } = useParams<RouteParams>();
	const personId = Number(id);

	const [person, setPerson] = useState<Person | null>(null);
	const [credits, setCredits] = useState<CombinedCredits | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!personId) return;

		let cancelled = false;

		const load = async () => {
			setLoading(true);
			setError(null);

			try {
				const [pRes, cRes] = await Promise.all([
					getPerson(personId),
					getPersonCombinedCredits(personId),
				]);

				if (cancelled) return;

				setPerson(pRes);
				setCredits(cRes);
			} catch (err) {
				if (!cancelled) {
					setError(
						err instanceof Error ? err.message : "Failed to load person details"
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

	const actingCredits = useMemo(() => credits?.cast ?? [], [credits]);

	if (loading && !person) {
		return <div className="py-10 text-center text-muted">Loading person…</div>;
	}

	if (error && !person) {
		return <div className="py-10 text-center text-red-400">{error}</div>;
	}

	if (!person) return null;

	const profile = person.profile_path
		? `https://image.tmdb.org/t/p/w500${person.profile_path}`
		: "/no-image.png";

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="pb-10"
		>
			{/* HERO HEADER */}
			<section className="relative -mx-4 mb-10 sm:mx-0">
				<div className="relative mx-auto max-w-7xl flex gap-6 px-4 py-12 sm:px-6 lg:px-8">
					{/* IMAGE */}
					<div className="w-40 sm:w-48 md:w-56 shrink-0">
						<img
							src={profile}
							alt={person.name}
							className="rounded-xl shadow-card border border-token object-cover"
						/>
					</div>

					{/* INFO */}
					<div className="flex flex-col gap-4 flex-1">
						<h1 className="text-3xl font-semibold text-foreground">
							{person.name}
						</h1>

						<div className="grid grid-cols-2 sm:grid-cols-3 gap-y-2 gap-x-4 text-sm text-muted max-w-lg">
							{person.known_for_department && (
								<p>
									<span className="text-foreground font-medium">
										Known for:{" "}
									</span>
									{person.known_for_department}
								</p>
							)}
							{person.birthday && (
								<p>
									<span className="text-foreground font-medium">Born: </span>
									{person.birthday}
								</p>
							)}
							{person.deathday && (
								<p>
									<span className="text-foreground font-medium">Died: </span>
									{person.deathday}
								</p>
							)}
							{person.place_of_birth && (
								<p>
									<span className="text-foreground font-medium">
										Birthplace:{" "}
									</span>
									{person.place_of_birth}
								</p>
							)}
							{person.homepage && (
								<p>
									<span className="text-foreground font-medium">Website: </span>
									<a
										href={person.homepage}
										target="_blank"
										rel="noreferrer"
										className="text-accent hover:underline"
									>
										Visit →
									</a>
								</p>
							)}
						</div>

						{person.biography && (
							<p className="text-sm text-muted max-w-2xl">{person.biography}</p>
						)}
					</div>
				</div>
			</section>

			{/* ACTING TIMELINE */}
			<section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<PersonActingTimeline
					credits={actingCredits}
					title="Acting"
					eyebrow="Film & TV Credits"
				/>
			</section>
		</motion.div>
	);
}
