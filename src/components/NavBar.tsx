import { Link } from "react-router-dom";
import "../styles/navbar.css";

function navbar() {
	return (
		<nav className="navbar">
			<div className="navbar-brand">
				<Link to="/">Movie App</Link>
			</div>
			<div className="navbar-links">
				<Link to="/">Home</Link>
				<Link to="/favorites">Favorites</Link>
			</div>
		</nav>
	);
}

export default navbar;
