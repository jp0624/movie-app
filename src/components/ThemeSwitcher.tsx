import { useTheme } from "../contexts/ThemeContext";

export default function ThemeSwitcher() {
	const { theme, toggleTheme } = useTheme();

	return (
		<button
			onClick={toggleTheme}
			className="
				fixed bottom-6 right-6 z-50 
				bg-gray-800 dark:bg-gray-700 
				text-white p-3 rounded-full 
				shadow-lg hover:scale-105 
				transition-all duration-200
			"
			title="Toggle theme"
		>
			{theme === "dark" ? "☀️" : "🌙"}
		</button>
	);
}
