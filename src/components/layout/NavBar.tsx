// src/components/layout/NavBar.tsx
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useMovie } from "../../contexts/MovieContext";
import ThemeToggle from "./ThemeToggle";

export default function NavBar() {
	const { favorites } = useMovie();
	const [open, setOpen] = useState(false);

	const navItems = [
		{ to: "/", label: "Home" },
		{ to: "/favorites", label: `Favorites (${favorites.length})` },
		{ to: "/search", label: "Search" },
	];

	return (
		<header className="sticky top-0 z-40 w-full backdrop-blur bg-background/80 border-b border-token">
			<div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
				{/* BRAND */}
				<NavLink
					to="/"
					className="text-xl font-bold tracking-tight text-foreground hover:text-accent"
				>
					CineScope
				</NavLink>

				{/* Desktop Nav */}
				<nav className="hidden gap-6 text-sm font-medium sm:flex">
					{navItems.map((item) => (
						<NavLink
							key={item.to}
							to={item.to}
							className={({ isActive }) =>
								`transition hover:text-accent ${
									isActive ? "text-accent font-semibold" : "text-foreground"
								}`
							}
						>
							{item.label}
						</NavLink>
					))}
				</nav>

				{/* Theme + Mobile Toggle */}
				<div className="flex items-center gap-3">
					<ThemeToggle />
					<button
						className="sm:hidden text-xl"
						onClick={() => setOpen((o) => !o)}
					>
						{open ? "✖" : "☰"}
					</button>
				</div>
			</div>

			{/* Mobile Menu */}
			{open && (
				<nav className="sm:hidden border-t border-token bg-background px-4 py-3">
					<div className="flex flex-col gap-3 text-sm font-medium">
						{navItems.map((item) => (
							<NavLink
								key={item.to}
								to={item.to}
								onClick={() => setOpen(false)}
								className={({ isActive }) =>
									`transition hover:text-accent ${
										isActive ? "text-accent font-semibold" : "text-foreground"
									}`
								}
							>
								{item.label}
							</NavLink>
						))}
					</div>
				</nav>
			)}
		</header>
	);
}
