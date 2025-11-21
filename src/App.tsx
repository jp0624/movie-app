import NavBar from "./components/NavBar.tsx";
import Favorites from "./pages/Favorites.tsx";
import Home from "./pages/Home.tsx";
import { Route, Routes } from "react-router-dom";
import { MovieProvider } from "./contexts/MovieContext.tsx";
import "./styles/App.css";

function App() {
	return (
		<MovieProvider>
			<NavBar />
			<main className="main-content">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/favorites" element={<Favorites />} />
				</Routes>
			</main>
		</MovieProvider>
	);
}

export default App;
