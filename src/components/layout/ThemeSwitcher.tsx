// src/components/layout/ThemeSwitcher.tsx
import { useTheme } from "../../contexts/ThemeContext";
import ThemeToggle from "./ThemeToggle";

export default function ThemeSwitcher() {
	const { theme, setTheme } = useTheme();

	return (
		<div className="flex items-center gap-3">
			<ThemeToggle
				checked={theme === "dark"}
				onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
			/>
		</div>
	);
}
