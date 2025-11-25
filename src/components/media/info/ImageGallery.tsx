// src/components/media/ImageGallery.tsx
interface GalleryImage {
	file_path: string;
	aspect_ratio?: number;
	width?: number;
	height?: number;
}

interface ImageGalleryProps {
	backdrops?: GalleryImage[];
	posters?: GalleryImage[];
	stills?: GalleryImage[];
	logos?: GalleryImage[];
	profiles?: GalleryImage[];
}

export default function ImageGallery({
	backdrops = [],
	posters = [],
	stills = [],
	logos = [],
	profiles = [],
}: ImageGalleryProps) {
	const all = [
		...backdrops.map((i) => ({ ...i, type: "backdrop" })),
		...posters.map((i) => ({ ...i, type: "poster" })),
		...stills.map((i) => ({ ...i, type: "still" })),
		...logos.map((i) => ({ ...i, type: "logo" })),
		...profiles.map((i) => ({ ...i, type: "profile" })),
	];

	return (
		<div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{all.map((img, idx) => (
				<div
					key={`${img.file_path}-${idx}`}
					className="rounded-xl overflow-hidden border border-token bg-surface-alt"
				>
					<img
						src={`https://image.tmdb.org/t/p/w780${img.file_path}`}
						loading="lazy"
						alt={img.type}
						className="w-full h-full object-cover"
					/>
				</div>
			))}
		</div>
	);
}
