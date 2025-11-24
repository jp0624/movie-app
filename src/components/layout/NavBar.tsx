// src/components/layout/NavBar.tsx
import { NavLink } from "react-router-dom";
import { useSettings } from "../../contexts/SettingsContext";
import { motion } from "framer-motion";

export default function NavBar() {
	const { open } = useSettings();

	const linkBase = "pb-1 border-b-2 text-sm font-medium transition-colors";
	const linkInactive = "border-transparent text-muted hover:text-foreground";
	const linkActive = "border-accent text-foreground";

	return (
		<motion.header
			initial={{ y: -20, opacity: 0 }}
			animate={{ y: 0, opacity: 1 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="relative fixed inset-x-0 top-0 z-30 border-b border-token bg-surface/80 backdrop-blur-md"
		>
			<nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
				{/* Logo */}
				<NavLink to="/" className="flex items-center">
					<div className="flex h-8 w-8 items-center mr-2 justify-center rounded-md bg-accent text-sm font-bold text-white shadow-card">
						▶︎
					</div>
					<span className="hidden text-xl font-semibold text-foreground sm:inline">
						SHOW
					</span>
					<span className="hidden text-lg font-semibold text-foreground pt-0.5 sm:inline text-accent">
						SCENES
					</span>
				</NavLink>

				{/* Center links */}
				<div className="flex items-center gap-6 text-sm">
					<NavLink
						to="/"
						className={({ isActive }) =>
							`${linkBase} ${isActive ? linkActive : linkInactive}`
						}
					>
						Discover
					</NavLink>

					<NavLink
						to="/search"
						className={({ isActive }) =>
							`${linkBase} ${isActive ? linkActive : linkInactive}`
						}
					>
						Search
					</NavLink>

					<NavLink
						to="/favorites"
						className={({ isActive }) =>
							`${linkBase} ${isActive ? linkActive : linkInactive}`
						}
					>
						Favorites
					</NavLink>
				</div>

				{/* Right: Settings gear (white icon, no text) */}
				<button
					type="button"
					onClick={open}
					aria-label="Open settings"
					className="flex h-9 w-9 items-center justify-center rounded-full border border-token bg-surface-alt text-white shadow-card hover:border-accent hover:text-accent transition-colors"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						className="h-5 w-5"
						fill="none"
						stroke="currentColor"
						strokeWidth="1.8"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<circle cx="12" cy="12" r="3" />
						<path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 8 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 3.6 15a1.65 1.65 0 0 0-1.51-1H2a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 3.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8 3.6a1.65 1.65 0 0 0 1-1.51V2a2 2 0 0 1 4 0v.09A1.65 1.65 0 0 0 16 3.6a1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.36.32.6.78.6 1.3v.4c0 .52-.24.98-.6 1.3z" />
					</svg>
				</button>
			</nav>
		</motion.header>
	);
}
