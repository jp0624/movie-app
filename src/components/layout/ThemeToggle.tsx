// src/components/layout/ThemeToggle.tsx
import { useTheme } from "../../contexts/ThemeContext";
import { motion } from "framer-motion";

export default function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	const isDark = theme === "dark";

	return (
		<button
			onClick={toggleTheme}
			className="relative w-16 h-7 rounded-full bg-surface-alt border border-token flex items-center px-1 shadow-card"
			aria-label="Toggle theme"
		>
			<motion.div
				layout
				transition={{ type: "spring", stiffness: 250, damping: 22 }}
				className={`h-5 w-5 rounded-full shadow-card ${
					isDark ? "bg-accent" : "bg-white"
				}`}
				style={{
					x: isDark ? 32 : 0,
				}}
			/>

			{/* Icons */}
			<div className="absolute left-2 text-[10px] text-muted pointer-events-none">
				🌞
			</div>
			<div className="absolute right-2 text-[10px] text-muted pointer-events-none">
				🌙
			</div>
		</button>
	);
}
