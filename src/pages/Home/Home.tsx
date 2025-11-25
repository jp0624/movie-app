// src/pages/Home/Home.tsx
import { useState, useEffect } from "react";

import HomeHero from "./HomeHero";
import HomeGrid from "./HomeGrid";

export default function Home() {
	return (
		<div className="min-h-screen pt-20">
			<HomeHero />
			<HomeGrid />
		</div>
	);
}
