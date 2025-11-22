// src/components/MovieSkeleton.tsx
import { motion } from "framer-motion";

export default function MovieSkeleton() {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			className="rounded-xl overflow-hidden bg-zinc-900/80 border border-zinc-800/70"
		>
			<div className="w-full aspect-[2/3] bg-zinc-800 animate-pulse" />
			<div className="p-3 space-y-2">
				<div className="h-4 bg-zinc-800 rounded w-3/4 animate-pulse" />
				<div className="h-3 bg-zinc-800 rounded w-1/3 animate-pulse" />
			</div>
		</motion.div>
	);
}
