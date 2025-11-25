// src/components/media/carousels/CastCarousel.tsx
import CarouselRow from "../../ui/CarouselRow";
import PersonCard from "../cards/PersonCard";

interface Props {
	cast: any[];
}

export default function CastCarousel({ cast }: Props) {
	if (!Array.isArray(cast)) return null;

	return (
		<CarouselRow
			items={cast}
			renderItem={(person) => <PersonCard person={person} />}
			itemWidth={150}
		/>
	);
}
