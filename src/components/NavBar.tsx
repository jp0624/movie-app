import { Link } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

export default function NavBar() {
	const { theme, toggleTheme } = useTheme();

	return (
		<nav className="bg-white dark:bg-black shadow px-6 py-4 flex justify-between items-center">
			<Link
				to="/"
				className="text-2xl font-bold text-red-600 dark:text-red-500"
			>
				Movie App
			</Link>

			<div className="flex gap-6 items-center">
				<Link
					className="text-gray-700 dark:text-gray-300 hover:text-red-400"
					to="/"
				>
					Home
				</Link>
				<Link
					className="text-gray-700 dark:text-gray-300 hover:text-red-400"
					to="/favorites"
				>
					Favorites
				</Link>

				<button
					onClick={toggleTheme}
					className="px-3 py-1 text-sm bg-gray-300 dark:bg-gray-700 text-black dark:text-white rounded"
				>
					{theme === "dark" ? "Light" : "Dark"}
				</button>
			</div>
		</nav>
	);
}
