/**
 * Planet popup
 */

import React, { useContext, useEffect, useState } from 'react'
import { WebsocketContext } from '../../context/websocket';

const PlanetPopup = (props) => {
	const { planetId } = props
	const [ready, val, emit] = useContext(WebsocketContext);
	const [list, setList] = useState([])

	useEffect(() => {
		if (ready) {
			emit('miner', {
				action: 'getList',
				payload: {
					planetId: planetId
				}
			})
		}

	}, [ready]);

	useEffect(() => {
		if (val && val.type === 'miner' && val.action === 'getList') {
			const miners = val.data.filter(d => d.planetId === planetId)
			setList(miners)
		} else if (val && val.action === 'newSimData') {
			const miners = val.data.miners.filter(d => d.planetId === planetId)
			setList(miners)
		}
	}, [val])

	return <div className="scrollable">
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Carry capacity</th>
					<th>Travel speed</th>
					<th>Mining speed</th>
					<th>Position (x, y)</th>
					<th>Status</th>
				</tr>
			</thead>

			<tbody>
				{
					list.map(item => {
						switch (item.status) {
							case 0:
								item.status = 'Idle'
								break;
							case 1:
								item.status = 'Travelling'
								break;
							case 2:
								item.status = 'Mining'
								break;
							case 3:
								item.status = 'Transfering minerals to planet'
						}
						return (
							<tr key={item.id}>
								<td>{item.name}</td>
								<td>{item.carryCapacity}</td>
								<td>{item.travelSpeed}</td>
								<td>{item.miningSpeed}</td>
								<td>{item.position.x}, {item.position.y}</td>
								<td>{item.status}</td>
							</tr>
						)
					})
				}
			</tbody>
		</table>
	</div>
}

export default PlanetPopup