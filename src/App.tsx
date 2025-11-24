// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./contexts/ThemeContext";
import { SettingsProvider } from "./contexts/SettingsContext";

import NavBar from "./components/layout/NavBar";
import SettingsPanel from "./components/layout/SettingsPanel";

import Home from "./pages/Home";
import SearchPage from "./pages/search/SearchPage";
import FavoritesPage from "./pages/Favorites";

import MovieDetails from "./pages/movie/MovieDetails";
import TvDetails from "./pages/tv/TvDetails";
import SeasonDetails from "./pages/tv/SeasonDetails";
import EpisodeDetails from "./pages/tv/EpisodeDetails";
import PersonDetails from "./pages/person/PersonDetails";
import { MovieProvider } from "./contexts/MovieContext";

export default function App() {
	return (
		<ThemeProvider>
			<MovieProvider>
				<SettingsProvider>
					<BrowserRouter>
						<NavBar />
						<SettingsPanel />

						<Routes>
							<Route path="/" element={<Home />} />
							<Route path="/search" element={<SearchPage />} />
							<Route path="/favorites" element={<FavoritesPage />} />

							{/* DETAILS */}
							<Route path="/movie/:id" element={<MovieDetails />} />
							<Route path="/tv/:id" element={<TvDetails />} />
							<Route
								path="/tv/:id/season/:seasonNumber"
								element={<SeasonDetails />}
							/>
							<Route
								path="/tv/:id/season/:seasonNumber/episode/:episodeNumber"
								element={<EpisodeDetails />}
							/>
							<Route path="/person/:id" element={<PersonDetails />} />
						</Routes>
					</BrowserRouter>
				</SettingsProvider>
			</MovieProvider>
		</ThemeProvider>
	);
}
