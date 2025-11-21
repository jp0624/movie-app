import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import MovieDetails from "./pages/MovieDetails";
import { MovieProvider } from "./contexts/MovieContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import ThemeSwitcher from "./components/ThemeSwitcher";

export default function App() {
	return (
		<ThemeProvider>
			<MovieProvider>
				<NavBar />

				{/* Floating toggle switcher */}
				<ThemeSwitcher />

				<main className="max-w-7xl mx-auto w-full">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/favorites" element={<Favorites />} />
						<Route path="/movie/:id" element={<MovieDetails />} />
					</Routes>
				</main>
			</MovieProvider>
		</ThemeProvider>
	);
}
