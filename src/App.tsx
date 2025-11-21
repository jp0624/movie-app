import NavBar from "./components/NavBar.tsx";
import Favorites from "./pages/Favorites.tsx";
import Home from "./pages/Home.tsx";
import { Route, Routes } from "react-router-dom";

function App() {
	return (
		<>
			<NavBar />
			<main className="main-content">
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/favorites" element={<Favorites />} />
				</Routes>
			</main>
		</>
	);
}

export default App;
