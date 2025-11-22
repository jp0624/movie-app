// src/App.tsx
import { Routes, Route } from "react-router-dom";

import { MovieProvider } from "./contexts/MovieContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import { SettingsProvider } from "./contexts/SettingsContext";

import NavBar from "./components/layout/NavBar";
import SettingsPanel from "./components/layout/SettingsPanel";

import Home from "./pages/Home";
import Favorites from "./pages/Favorites";

import MovieDetails from "./pages/movie/MovieDetails";
import TvDetails from "./pages/tv/TvDetails";
import SeasonDetails from "./pages/tv/SeasonDetails";
import EpisodeDetails from "./pages/tv/EpisodeDetails";

import PersonDetails from "./pages/person/PersonDetails";

import SearchPage from "./pages/search/SearchPage";

export default function App() {
	return (
		<ThemeProvider>
			<MovieProvider>
				<SettingsProvider>
					<NavBar />

					{/* MAIN ROUTER OUTLET */}
					<main className="max-w-7xl mx-auto w-full">
						<Routes>
							{/* Home & search */}
							<Route path="/" element={<Home />} />
							<Route path="/search" element={<SearchPage />} />

							{/* Favorites */}
							<Route path="/favorites" element={<Favorites />} />

							{/* Movies */}
							<Route path="/movie/:id" element={<MovieDetails />} />

							{/* TV */}
							<Route path="/tv/:id" element={<TvDetails />} />
							<Route
								path="/tv/:id/season/:seasonNumber"
								element={<SeasonDetails />}
							/>
							<Route
								path="/tv/:id/season/:seasonNumber/episode/:episodeNumber"
								element={<EpisodeDetails />}
							/>

							{/* People */}
							<Route path="/person/:id" element={<PersonDetails />} />
						</Routes>
					</main>

					{/* ⚙️ Floating UX settings */}
					<SettingsPanel />
				</SettingsProvider>
			</MovieProvider>
		</ThemeProvider>
	);
}
