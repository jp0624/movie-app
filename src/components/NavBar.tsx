import { Link } from "react-router-dom";

function NavBar() {
	return (
		<nav className="navBar">
			<div className="navBar-brand">
				<Link to="/">Movie App</Link>
			</div>
			<div className="navBar-links">
				<Link to="/">Home</Link>
				<Link to="/favorites">Favorites</Link>
			</div>
		</nav>
	);
}

export default NavBar;
