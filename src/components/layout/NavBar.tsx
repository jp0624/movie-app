// src/components/layout/NavBar.tsx
import { Link, NavLink } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
	return (
		<header className="sticky top-0 z-40 border-b border-token bg-surface/90 backdrop-blur">
			<div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
				{/* Left: Logo / Brand */}
				<Link to="/" className="flex items-center gap-2">
					<div className="h-7 w-7 rounded-lg bg-red-600 shadow-card" />
					<div className="leading-tight">
						<p className="text-sm font-semibold tracking-[0.18em] uppercase text-muted">
							Cinematic
						</p>
						<p className="text-base font-semibold text-foreground">Universe</p>
					</div>
				</Link>

				{/* Center: Nav links */}
				<nav className="flex flex-1 items-center justify-center gap-6 text-sm">
					<NavLink
						to="/"
						className={({ isActive }) =>
							[
								"transition-colors",
								isActive
									? "text-foreground font-semibold"
									: "text-muted hover:text-foreground",
							].join(" ")
						}
					>
						Discover
					</NavLink>

					<NavLink
						to="/favorites"
						className={({ isActive }) =>
							[
								"transition-colors",
								isActive
									? "text-foreground font-semibold"
									: "text-muted hover:text-foreground",
							].join(" ")
						}
					>
						Favorites
					</NavLink>
				</nav>

				{/* Right: Theme toggle */}
				<div className="flex items-center gap-3">
					<ThemeToggle />
				</div>
			</div>
		</header>
	);
}
