// src/components/Tabs.tsx
import { motion } from "framer-motion";

const TABS = ["Popular", "Top Rated", "Trending", "Now Playing"] as const;
type TabKey = (typeof TABS)[number];

interface Props {
	active: TabKey;
	setActive: (tab: TabKey) => void;
}

export default function Tabs({ active, setActive }: Props) {
	return (
		<div className="mt-4 border-b border-zinc-800">
			<div className="flex gap-4">
				{TABS.map((tab) => {
					const isActive = active === tab;
					return (
						<button
							key={tab}
							type="button"
							onClick={() => setActive(tab)}
							className={`
								relative pb-2 text-sm md:text-base 
								text-zinc-400 hover:text-zinc-100 
								transition-colors
							`}
						>
							{tab}
							{isActive && (
								<motion.div
									layoutId="tab-underline"
									className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-red-500"
								/>
							)}
						</button>
					);
				})}
			</div>
		</div>
	);
}
