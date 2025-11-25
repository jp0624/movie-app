// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";

import NavBar from "./components/layout/NavBar";
import SuspenseBoundary from "./components/system/SuspenseBoundary";
import ErrorBoundary from "./components/system/ErrorBoundary";

// Home
import Home from "./pages/Home/Home";

// Favorites
import Favorites from "./pages/Favorites/Favorites";

// Movie
import MovieDetails from "./pages/Movie/MovieDetails";

// TV
import TvDetails from "./pages/Tv/TvDetails";
import SeasonDetails from "./pages/Tv/SeasonDetails";
import EpisodeDetails from "./pages/Tv/EpisodeDetails";

// Person
import PersonDetails from "./pages/Person/PersonDetails";

// Search
import SearchPage from "./pages/Search/SearchPage";

export default function App() {
	return (
		<BrowserRouter>
			<div className="min-h-screen bg-background text-foreground">
				<NavBar />

				<ErrorBoundary>
					<SuspenseBoundary>
						<Routes>
							{/* HOME */}
							<Route path="/" element={<Home />} />

							{/* FAVORITES */}
							<Route path="/favorites" element={<Favorites />} />

							{/* MOVIE */}
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

							{/* PERSON */}
							<Route path="/person/:id" element={<PersonDetails />} />

							{/* SEARCH */}
							<Route path="/search" element={<SearchPage />} />
						</Routes>
					</SuspenseBoundary>
				</ErrorBoundary>
			</div>
		</BrowserRouter>
	);
}
