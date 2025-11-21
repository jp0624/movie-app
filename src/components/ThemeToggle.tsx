// src/components/ThemeToggle.tsx
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export default function ThemeToggle() {
	const [theme, setTheme] = useState<"light" | "dark">(() => {
		if (typeof window !== "undefined") {
			return (localStorage.getItem("theme") as "light" | "dark") || "dark";
		}
		return "dark";
	});
	const [snapping, setSnapping] = useState(false);

	useEffect(() => {
		const root = document.documentElement;

		if (theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}

		localStorage.setItem("theme", theme);
	}, [theme]);

	const handleToggle = () => {
		// Trigger "snap" overlay
		setSnapping(true);
		setTheme((prev) => (prev === "dark" ? "light" : "dark"));

		setTimeout(() => setSnapping(false), 500);
	};

	return (
		<>
			<button
				onClick={handleToggle}
				aria-label="Toggle theme"
				className="
					relative w-16 h-8 rounded-full
					bg-zinc-300 dark:bg-zinc-700
					flex items-center px-1
					transition-colors duration-300
					border border-zinc-400/60 dark:border-zinc-500/60
				"
			>
				<motion.div
					layout
					transition={{ type: "spring", stiffness: 400, damping: 25 }}
					className={`
						w-6 h-6 rounded-full
						bg-white dark:bg-black
						shadow
						flex items-center justify-center
						text-xs
					`}
					style={{
						x: theme === "dark" ? 32 : 0,
					}}
				>
					<span>{theme === "dark" ? "🌙" : "☀️"}</span>
				</motion.div>
			</button>

			<AnimatePresence>
				{snapping && (
					<motion.div
						className="fixed inset-0 pointer-events-none z-40 bg-gradient-to-tr from-purple-500/40 via-transparent to-yellow-500/40 dark:from-yellow-500/40 dark:to-purple-500/40 backdrop-blur-[1px]"
						initial={{ opacity: 0, scale: 1.1 }}
						animate={{ opacity: 1, scale: 1 }}
						exit={{ opacity: 0, scale: 1.05 }}
						transition={{ duration: 0.45, ease: "easeOut" }}
					/>
				)}
			</AnimatePresence>
		</>
	);
}
