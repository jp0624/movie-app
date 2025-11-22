// src/components/media/CastCarousel.tsx
import { Link } from "react-router-dom";
import type { CastMember } from "../../types/Shared";
import CarouselRow from "../ui/CarouselRow";

interface Props {
	cast?: CastMember[];
}

export default function CastCarousel({ cast = [] }: Props) {
	if (!cast.length) return null;

	return (
		<CarouselRow>
			{cast.map((person) => {
				const img = person.profile_path
					? `https://image.tmdb.org/t/p/w185${person.profile_path}`
					: "/no-image.png";

				return (
					<Link
						key={person.id}
						to={`/person/${person.id}`}
						className="w-32 shrink-0 rounded-lg border border-token bg-surface-alt p-2 text-xs text-foreground hover:-translate-y-1 hover:shadow-card transition-transform"
					>
						<img
							src={img}
							alt={person.name}
							className="mb-2 h-32 w-full rounded-md object-cover"
						/>
						<p className="font-semibold line-clamp-2">{person.name}</p>
						{person.character && (
							<p className="text-[11px] text-muted line-clamp-2">
								as {person.character}
							</p>
						)}
					</Link>
				);
			})}
		</CarouselRow>
	);
}
