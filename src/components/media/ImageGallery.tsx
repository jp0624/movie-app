// src/components/media/ImageGallery.tsx
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import Tabs, { type TabItem } from "../Tabs";
import type { ImageAsset } from "../../types/Shared";

interface ImageGalleryProps {
	backdrops?: ImageAsset[];
	posters?: ImageAsset[];
	logos?: ImageAsset[];
	stills?: ImageAsset[];
	profiles?: ImageAsset[];
}

type ImageCategory = "backdrops" | "posters" | "logos" | "stills" | "profiles";

export default function ImageGallery({
	backdrops = [],
	posters = [],
	logos = [],
	stills = [],
	profiles = [],
}: ImageGalleryProps) {
	const availableTabs = useMemo(() => {
		const tabs: { id: ImageCategory; label: string }[] = [];

		if (backdrops.length > 0)
			tabs.push({ id: "backdrops", label: "Backdrops" });
		if (posters.length > 0) tabs.push({ id: "posters", label: "Posters" });
		if (logos.length > 0) tabs.push({ id: "logos", label: "Logos" });
		if (stills.length > 0) tabs.push({ id: "stills", label: "Stills" });
		if (profiles.length > 0) tabs.push({ id: "profiles", label: "Profiles" });

		return tabs;
	}, [backdrops, posters, logos, stills, profiles]);

	if (availableTabs.length === 0) return null;

	const tabItems: TabItem[] = availableTabs.map((t) => ({
		id: t.id,
		label: t.label,
	}));

	const [activeTab, setActiveTab] = useState<ImageCategory>(
		availableTabs[0].id
	);

	let activeImages: ImageAsset[] = [];
	let aspect: "backdrop" | "poster" | "logo" | "profile" = "backdrop";

	switch (activeTab) {
		case "backdrops":
			activeImages = backdrops;
			aspect = "backdrop";
			break;
		case "posters":
			activeImages = posters;
			aspect = "poster";
			break;
		case "logos":
			activeImages = logos;
			aspect = "logo";
			break;
		case "stills":
			activeImages = stills;
			aspect = "backdrop";
			break;
		case "profiles":
			activeImages = profiles;
			aspect = "profile";
			break;
	}

	const itemHeight =
		aspect === "backdrop"
			? "h-40 sm:h-48"
			: aspect === "logo"
			? "h-20"
			: "h-44";

	return (
		<div className="space-y-3">
			{/* Tabs */}
			<Tabs
				tabs={tabItems}
				value={activeTab}
				onChange={(id) => setActiveTab(id as ImageCategory)}
			/>

			{/* Images strip */}
			<div className="flex gap-3 overflow-x-auto pb-1">
				{activeImages.slice(0, 24).map((img, idx) => (
					<motion.img
						key={`${activeTab}-${img.file_path}-${idx}`}
						src={`https://image.tmdb.org/t/p/${
							aspect === "poster" || aspect === "profile" ? "w342" : "w780"
						}${img.file_path}`}
						alt={activeTab}
						className={`flex-none ${itemHeight} w-auto rounded-lg border border-token bg-surface-alt object-cover`}
						initial={{ opacity: 0, y: 15 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{
							duration: 0.35,
							delay: idx * 0.04,
						}}
					/>
				))}
			</div>
		</div>
	);
}
