/**
 * Nav component
 */
import { NavLink } from "react-router-dom"

function Nav() {
	return (
		<nav>
			<NavLink to="/miners" className="icon-miner" activeClassName="active">Miners</NavLink>
			<NavLink to="/asteroids" className="icon-asteroid" activeClassName="active">Asteroids</NavLink>
			<NavLink to="/planets" className="icon-planet" activeClassName="active">Planets</NavLink>
		</nav>
	);
}

export default Nav