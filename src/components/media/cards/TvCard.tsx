// src/components/media/cards/TvCard.tsx
import { Link } from "react-router-dom";
import { preload } from "../../../hooks/useTmdbPreload";
import { getTv } from "../../../services/api";
import { tmdbPoster } from "../../../utils/tmdbImage";

interface Props {
	show: any;
}

export default function TvCard({ show }: Props) {
	const id = show?.id;
	const title = show.name ?? "(Untitled)";
	const poster = show.poster_path
		? tmdbPoster(show.poster_path, "md")
		: "/no-image.png";

	function onHover() {
		if (id) preload(() => getTv(id));
	}

	return (
		<Link
			to={`/tv/${id}`}
			onMouseEnter={onHover}
			className="group relative block overflow-hidden rounded-xl bg-black border border-token aspect-[2/3]"
		>
			<img
				src={poster}
				alt={title}
				loading="lazy"
				className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] group-hover:brightness-90"
			/>

			<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

			<div className="absolute bottom-3 left-3 opacity-90 group-hover:opacity-100 transition">
				<h3 className="text-sm font-semibold text-white drop-shadow-md line-clamp-2">
					{title}
				</h3>
			</div>
		</Link>
	);
}
