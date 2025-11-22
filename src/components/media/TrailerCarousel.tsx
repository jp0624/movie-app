// src/components/media/TrailerCarousel.tsx
import type { Video } from "../../types/Shared";
import CarouselRow from "../ui/CarouselRow";

interface Props {
	videos?: Video[];
}

export default function TrailerCarousel({ videos = [] }: Props) {
	if (!videos.length) return null;

	const yt = videos.filter((v) => v.site === "YouTube");

	if (!yt.length) return null;

	return (
		<CarouselRow>
			{yt.map((v) => (
				<div key={v.id} className="w-72 shrink-0">
					<div className="aspect-video overflow-hidden rounded-lg border border-token bg-surface-alt">
						<iframe
							title={v.name}
							src={`https://www.youtube.com/embed/${v.key}`}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
							allowFullScreen
							className="h-full w-full"
						/>
					</div>
					<p className="mt-2 text-xs text-muted line-clamp-2">{v.name}</p>
				</div>
			))}
		</CarouselRow>
	);
}
