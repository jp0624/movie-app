// src/components/media/cards/SearchCard.tsx
import { Link } from "react-router-dom";
import { preload } from "../../../hooks/useTmdbPreload";
import { getMovie, getTv, getPerson } from "../../../services/api";
import { tmdbPoster } from "../../../utils/tmdbImage";

interface Props {
	item: any; // movie | tv | person
}

export default function SearchCard({ item }: Props) {
	const type = item.media_type;
	const id = item.id;

	function onHover() {
		if (type === "movie") preload(() => getMovie(id));
		else if (type === "tv") preload(() => getTv(id));
		else if (type === "person") preload(() => getPerson(id));
	}

	const displayTitle = item.title || item.name || "(Untitled)";

	const image =
		item.poster_path || item.profile_path
			? tmdbPoster(item.poster_path || item.profile_path, "md")
			: "/no-image.png";

	return (
		<Link
			to={
				type === "movie"
					? `/movie/${id}`
					: type === "tv"
					? `/tv/${id}`
					: `/person/${id}`
			}
			onMouseEnter={onHover}
			className="group relative overflow-hidden rounded-xl bg-black aspect-[2/3] border border-token"
		>
			<img
				src={image}
				className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] group-hover:brightness-90"
				loading="lazy"
				alt={displayTitle}
			/>

			<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

			<div className="absolute bottom-3 left-3 opacity-90 group-hover:opacity-100 transition">
				<h3 className="text-sm font-semibold text-white drop-shadow-md line-clamp-2">
					{displayTitle}
				</h3>
			</div>
		</Link>
	);
}
