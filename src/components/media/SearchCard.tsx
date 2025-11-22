// src/components/media/SearchCard.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import type { Movie } from "../../types/Movie";
import type { TvShow } from "../../types/Tv";
import type { Person } from "../../types/Person";

type SearchResult = (Movie | TvShow | Person) & {
	media_type?: "movie" | "tv" | "person";
};

interface Props {
	result: SearchResult;
}

export default function SearchCard({ result }: Props) {
	const mediaType = result.media_type ?? inferMediaType(result);
	const title =
		"title" in result
			? result.title
			: "name" in result
			? result.name
			: "Untitled";

	const isPerson = mediaType === "person";
	const imagePath =
		"poster_path" in result
			? result.poster_path
			: "profile_path" in result
			? result.profile_path
			: null;

	const imageUrl = imagePath
		? `https://image.tmdb.org/t/p/w300${imagePath}`
		: "/no-image.png";

	const href =
		mediaType === "movie"
			? `/movie/${result.id}`
			: mediaType === "tv"
			? `/tv/${result.id}`
			: `/person/${result.id}`;

	return (
		<Link to={href} className="block">
			<motion.div
				whileHover={{ scale: 1.04, y: -3 }}
				transition={{ type: "spring", stiffness: 260, damping: 20 }}
				className="overflow-hidden rounded-xl border border-token bg-surface shadow-card"
			>
				<div className="relative aspect-[2/3] w-full">
					<img
						src={imageUrl}
						alt={title ?? "Result"}
						className="h-full w-full object-cover"
					/>
					{mediaType && (
						<div className="absolute left-2 top-2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-zinc-100">
							{mediaType}
						</div>
					)}
				</div>
				<div className="p-2 text-xs text-muted">
					<p className="line-clamp-2 text-sm font-semibold text-foreground">
						{title}
					</p>
					{isPerson &&
						"known_for_department" in result &&
						result.known_for_department && (
							<p className="mt-1 text-[11px] text-muted">
								{result.known_for_department}
							</p>
						)}
				</div>
			</motion.div>
		</Link>
	);
}

function inferMediaType(result: any): "movie" | "tv" | "person" {
	if ("known_for_department" in result) return "person";
	if ("first_air_date" in result) return "tv";
	return "movie";
}
