/**
 * List of planets
 */

import React, { useContext, useEffect, useState } from 'react'
import Rodal from 'rodal'

import { WebsocketContext } from '../../context/websocket.jsx'
import CreateMinerForm from './createMiner.jsx'
import PopupContent from './popup.jsx'
import Loader from '../layout/loader.jsx'

const PlanetList = () => {
	const [planets, setPlanets] = React.useState([])
	const [loading, setLoading] = React.useState(false)
	const [popupVisible, setPopupVisible] = React.useState(false)
	const [formVisible, setFormVisible] = React.useState(false)
	const [selectedPlanetId, setSelectedPlanetId] = React.useState(0)
	const [ready, val, emit] = useContext(WebsocketContext);

	useEffect(() => {
		if (ready) {
			emit('planet', {
				action: 'getList'
			})
			setLoading(true)
		}

	}, [ready]);

	useEffect(() => {
		if (val) {
			setLoading(false)
			if (val.type === 'planet' && val.action === 'getList') {
				setPlanets(val.data)
				console.log('data', val.data)
			}
		}
	}, [val])

	const showPopup = (planetId) => {
		setPopupVisible(true)
		setSelectedPlanetId(planetId)
	}

	const showForm = (planetId) => {
		setFormVisible(true)
		setSelectedPlanetId(planetId)
	}

	return <div className="list">
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Miners</th>
					<th>Minerals</th>
					<th>Position (x, y)</th>
					<th></th>
				</tr>
			</thead>

			<tbody>
				{planets.map((planet) => (
					<tr
						key={planet._id}
						onClick={() => showPopup(planet.id)}
					>
						<td>{planet.name}</td>
						<td>{planet.miners.length}</td>
						<td>{planet.mineral || 0}/1000</td>
						<td>{planet.position.x},{planet.position.y}</td>
						<td><div className="icon-addminer" onClick={() => showForm(planet.id)}>Create a miner</div></td>
					</tr>
				))}
			</tbody>
		</table>

		<Rodal visible={popupVisible} onClose={() => setPopupVisible(false)} width="550" height="480">
			<h2>List of miners of Planet 1</h2>
			{
				loading ? <Loader /> : <PopupContent planetId={selectedPlanetId} />
			}
		</Rodal>

		<Rodal visible={formVisible} onClose={() => setFormVisible(false)} width="440" height="480">
			<h2>Create a miner</h2>
			<CreateMinerForm planetId={selectedPlanetId} />
		</Rodal>
	</div>
}

export default PlanetList