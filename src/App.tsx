import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import MovieDetails from "./pages/MovieDetails";
import { MovieProvider } from "./contexts/MovieContext";

export default function App() {
	return (
		<MovieProvider>
			<NavBar />

			<main className="max-w-7xl mx-auto w-full dark:bg-black bg-white min-h-screen">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/favorites" element={<Favorites />} />
					<Route path="/movie/:id" element={<MovieDetails />} />
				</Routes>
			</main>
		</MovieProvider>
	);
}
