/**
 * Main app layout
 */
import Header from './header.jsx'
import Nav from './nav.jsx'
import Miners from '../miner/list.jsx'
import Asteroids from '../asteroid/list.jsx'
import Planets from '../planet/list.jsx'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'
import { WebsocketProvider } from '../../context/websocket.context.js'

function App() {
	return (
		<Router>
			<WebsocketProvider>
			<main>
				<Header />			
				<Nav />
				
				<Switch>
					<Route path="/miners">
						<Miners />
					</Route>
					<Route path="/asteroids">
						<Asteroids />
					</Route>
					<Route path="/planets">
						<Planets />
					</Route>
				</Switch>
			</main>
			<aside />
			</WebsocketProvider>
		</Router>
	);
}

export default App