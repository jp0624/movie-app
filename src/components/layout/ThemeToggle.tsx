// src/components/layout/ThemeToggle.tsx
import { useTheme } from "../../contexts/ThemeContext";

export default function ThemeToggle() {
	const { theme, setTheme } = useTheme(); // expects "light" | "dark"

	const isDark = theme === "dark";

	const handleToggle = (value: "light" | "dark") => {
		if (value !== theme) {
			setTheme(value);
		}
	};

	return (
		<button
			type="button"
			className="relative inline-flex items-center rounded-full bg-surface-alt border border-token px-1 py-1 text-xs shadow-card"
			aria-label="Toggle theme"
		>
			{/* Track */}
			<div className="relative flex w-24 items-center justify-between text-[11px] font-medium">
				<span
					onClick={() => handleToggle("light")}
					className={`relative z-10 flex-1 cursor-pointer text-center transition-colors ${
						!isDark ? "text-foreground" : "text-muted"
					}`}
				>
					☀ Light
				</span>
				<span
					onClick={() => handleToggle("dark")}
					className={`relative z-10 flex-1 cursor-pointer text-center transition-colors ${
						isDark ? "text-foreground" : "text-muted"
					}`}
				>
					🌙 Dark
				</span>

				{/* Knob */}
				<div
					className={`pointer-events-none absolute inset-y-0 my-0.5 h-[calc(100%-4px)] w-[48%] rounded-full bg-background shadow-card transition-transform duration-300 ease-out ${
						isDark ? "translate-x-[100%]" : "translate-x-0"
					}`}
				/>
			</div>
		</button>
	);
}
