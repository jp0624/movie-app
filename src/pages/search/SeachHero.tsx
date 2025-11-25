// src/pages/Search/SearchHero.tsx
import ParallaxHero from "../../components/layout/Hero/ParallaxHero";

interface Props {
	query: string;
	backdrop?: string;
}

export default function SearchHero({ query, backdrop }: Props) {
	const bg =
		backdrop ?? "linear-gradient(180deg, #000000 0%, #111 40%, #000 100%)";

	return (
		<ParallaxHero
			slides={[
				{
					id: "search-bg",
					backdropUrl: bg,
					title: `Search results`,
					overview: `Showing results for "${query}"`,
					mediaType: "search",
				},
			]}
			autoAdvanceMs={0}
			height="min-h-[40vh]"
		>
			{({ slide }) => (
				<div className="max-w-3xl flex flex-col gap-3">
					<h1 className="text-4xl font-bold text-white">{slide.title}</h1>
					<p className="text-white/80 text-sm">{slide.overview}</p>
				</div>
			)}
		</ParallaxHero>
	);
}
