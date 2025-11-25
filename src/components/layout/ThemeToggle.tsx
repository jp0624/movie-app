// src/components/layout/ThemeToggle.tsx
import { useTheme } from "../../contexts/ThemeContext";

const LABELS: Record<"light" | "dark" | "cinematic", string> = {
	light: "Light",
	dark: "Dark",
	cinematic: "Cinematic",
};

const ICONS: Record<"light" | "dark" | "cinematic", string> = {
	light: "☀",
	dark: "🌙",
	cinematic: "🎬",
};

export default function ThemeToggle() {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			type="button"
			onClick={toggleTheme}
			className="inline-flex items-center gap-1 rounded-full border border-token bg-surface px-3 py-1 text-xs font-medium text-foreground shadow-sm transition hover:border-accent hover:text-accent"
			aria-label={`Switch theme (current: ${LABELS[theme]})`}
		>
			<span aria-hidden="true">{ICONS[theme]}</span>
			<span className="hidden sm:inline">{LABELS[theme]}</span>
		</button>
	);
}
