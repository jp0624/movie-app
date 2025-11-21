// src/components/NavBar.tsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
	return (
		<motion.nav
			initial={{ y: -40, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.5, ease: "easeOut" }}
			className="sticky top-0 z-30 bg-zinc-900/95 dark:bg-black/95 backdrop-blur border-b border-zinc-800"
		>
			<div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
				<Link to="/" className="flex items-baseline gap-2">
					<span className="text-xl font-bold text-red-500 tracking-tight">
						Movie
					</span>
					<span className="text-xl font-light text-zinc-200">Explorer</span>
				</Link>

				<div className="flex items-center gap-6">
					<Link
						to="/"
						className="text-sm md:text-base text-zinc-300 hover:text-white transition-colors"
					>
						Home
					</Link>
					<Link
						to="/favorites"
						className="text-sm md:text-base text-zinc-300 hover:text-white transition-colors"
					>
						Favorites
					</Link>

					<ThemeToggle />
				</div>
			</div>
		</motion.nav>
	);
}
