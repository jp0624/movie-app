// src/components/media/carousels/SeasonCarousel.tsx
import CarouselRow from "../../ui/CarouselRow";
import SeasonCard from "../cards/SeasonCard";

interface Props {
	seasons: any[];
	tvId: number;
}

export default function SeasonCarousel({ seasons, tvId }: Props) {
	if (!Array.isArray(seasons)) return null;

	return (
		<CarouselRow
			items={seasons}
			renderItem={(s) => <SeasonCard showId={tvId} season={s} />}
			itemWidth={150}
		/>
	);
}
