// src/components/media/cards/PersonCard.tsx
import { Link } from "react-router-dom";
import { preload } from "../../../hooks/useTmdbPreload";
import { getPerson } from "../../../services/api";
import { tmdbPoster } from "../../../utils/tmdbImage";

interface Props {
	person: any;
}

export default function PersonCard({ person }: Props) {
	const id = person?.id;
	const name = person.name ?? "(Unknown)";
	const poster = person.profile_path
		? tmdbPoster(person.profile_path, "md")
		: "/no-image.png";

	function onHover() {
		if (id) preload(() => getPerson(id));
	}

	return (
		<Link
			to={`/person/${id}`}
			onMouseEnter={onHover}
			className="group relative overflow-hidden rounded-xl bg-black aspect-[2/3] border border-token"
		>
			<img
				src={poster}
				alt={name}
				className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03] group-hover:brightness-90"
				loading="lazy"
			/>

			<div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />

			<div className="absolute bottom-3 left-3 opacity-90 group-hover:opacity-100 transition">
				<h3 className="text-sm font-semibold text-white drop-shadow-md line-clamp-2">
					{name}
				</h3>
			</div>
		</Link>
	);
}
