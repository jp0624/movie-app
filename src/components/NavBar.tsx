import { Link } from "react-router-dom";
import { useMovie } from "../contexts/MovieContext";

export default function NavBar() {
	const { theme, toggleTheme } = useMovie();

	return (
		<header className="sticky top-0 z-50 bg-black/90 backdrop-blur p-4 flex justify-between items-center shadow">
			<Link to="/" className="text-red-500 font-bold text-2xl">
				🎬 MovieApp
			</Link>

			<nav className="flex gap-6 text-white">
				<Link to="/" className="hover:text-red-400">
					Home
				</Link>
				<Link to="/favorites" className="hover:text-red-400">
					Favorites
				</Link>

				<button
					onClick={toggleTheme}
					className="bg-gray-800 px-3 py-1 rounded hover:bg-gray-700 ml-3"
				>
					{theme === "dark" ? "☀️ Light" : "🌙 Dark"}
				</button>
			</nav>
		</header>
	);
}
