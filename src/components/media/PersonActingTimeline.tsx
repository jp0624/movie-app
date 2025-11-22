// src/components/media/PersonActingTimeline.tsx
import type { CreditEntry } from "../../types/Shared";
import Surface from "../ui/Surface";
import SectionHeader from "../ui/SectionHeader";
import { Link } from "react-router-dom";

interface Props {
	credits?: CreditEntry[];
	title?: string;
	eyebrow?: string;
}

export default function PersonActingTimeline({
	credits = [],
	title = "Acting",
	eyebrow = "Film & TV credits",
}: Props) {
	if (!credits.length) return null;

	const sorted = [...credits].sort((a, b) => {
		const dateA = a.release_date ?? a.first_air_date ?? "";
		const dateB = b.release_date ?? b.first_air_date ?? "";
		return dateB.localeCompare(dateA);
	});

	return (
		<Surface>
			<SectionHeader title={title} eyebrow={eyebrow} />
			<div className="relative mt-2 border-l border-token pl-4">
				{sorted.map((c) => {
					const year =
						(c.release_date ?? c.first_air_date ?? "").split("-")[0] ?? "";
					const label = c.title ?? c.name ?? "Untitled";
					const path =
						c.media_type === "movie" ? `/movie/${c.id}` : `/tv/${c.id}`;

					return (
						<div
							key={`${c.media_type}-${c.id}-${c.character ?? ""}`}
							className="mb-4"
						>
							<div className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-accent" />
							<div className="ml-2">
								<div className="flex items-center gap-2 text-xs text-muted">
									{year && <span>{year}</span>}
									<span className="text-[10px] uppercase tracking-wide">
										{c.media_type === "movie" ? "Movie" : "TV"}
									</span>
								</div>
								<Link
									to={path}
									className="text-sm font-semibold text-foreground hover:underline"
								>
									{label}
								</Link>
								{c.character && (
									<p className="text-xs text-muted">as {c.character}</p>
								)}
							</div>
						</div>
					);
				})}
			</div>
		</Surface>
	);
}
