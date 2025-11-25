// src/components/media/PersonActingTimeline.tsx
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { CreditEntry } from "../../../types/Shared";
import Surface from "../../ui/Surface";
import SectionHeader from "../../ui/SectionHeader";

interface Props {
	credits?: CreditEntry[];
	title?: string;
	eyebrow?: string;
}

const PAGE_SIZE = 30;

export default function PersonActingTimeline({
	credits = [],
	title = "Acting",
	eyebrow = "Film & TV credits",
}: Props) {
	const sortedCredits = useMemo(() => {
		return [...credits]
			.filter((c) => c.media_type === "movie" || c.media_type === "tv")
			.sort((a, b) => {
				const aDate = a.release_date || a.first_air_date || "";
				const bDate = b.release_date || b.first_air_date || "";
				return bDate.localeCompare(aDate);
			});
	}, [credits]);

	const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
	const visible = sortedCredits.slice(0, visibleCount);
	const canShowMore = visibleCount < sortedCredits.length;

	if (!sortedCredits.length) return null;

	return (
		<Surface>
			<SectionHeader title={title} eyebrow={eyebrow} />
			<div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
				{visible.map((c) => {
					const isMovie = c.media_type === "movie";
					const year =
						(c.release_date || c.first_air_date || "").split("-")[0] || "—";
					const label = c.title || c.name || "Untitled";

					const to = isMovie ? `/movie/${c.id}` : `/tv/${c.id}`;

					return (
						<div
							key={`${c.media_type}-${c.id}-${c.episode_count ?? ""}-${year}`}
							className="flex items-start gap-3 rounded-lg border border-token bg-surface-alt p-2 text-sm"
						>
							<div className="w-14 shrink-0 text-xs font-mono text-muted">
								{year}
							</div>
							<div className="flex-1">
								<Link
									to={to}
									className="font-semibold text-foreground hover:underline"
								>
									{label}
								</Link>
								{c.character && (
									<p className="text-xs text-muted">as {c.character}</p>
								)}
								{c.episode_count && (
									<p className="text-[11px] text-muted mt-0.5">
										{c.episode_count} episode
										{c.episode_count !== 1 ? "s" : ""}
									</p>
								)}
							</div>
						</div>
					);
				})}
			</div>

			{canShowMore && (
				<div className="mt-3 text-center">
					<button
						type="button"
						onClick={() =>
							setVisibleCount((prev) =>
								Math.min(prev + PAGE_SIZE, sortedCredits.length)
							)
						}
						className="inline-flex items-center rounded-full border border-token bg-surface px-3 py-1 text-xs font-medium text-foreground hover:bg-surface-alt"
					>
						Show more ({sortedCredits.length - visibleCount} remaining)
					</button>
				</div>
			)}
		</Surface>
	);
}
