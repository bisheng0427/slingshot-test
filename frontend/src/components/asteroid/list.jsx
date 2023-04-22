/**
 * List of asteroids
 */

import React from 'react'
import { useContext, useState, useEffect } from 'react';
import { WebsocketContext } from '../../context/websocket';

const AsteroidList = () => {
	const [ready, val, emit] = useContext(WebsocketContext);
	const [list, setList] = useState([])

	useEffect(() => {
		if (ready) {
			emit('asteroid', {
				action: 'getList'
			})
		}

	}, [ready]);

	useEffect(() => {
		if (val && val.type === 'asteroid' && val.action === 'getList') {
			setList(val.data)
		} else if (val && val.action === 'newSimData') {
			const asteroids = val.data.asteroids.map(asteroid => {
				const miners = val.data.miners.filter(miner => miner.targetAsteroidId === asteroid._id && miner.status === 2)
				return {
					...asteroid,
					miners: miners
				}
			})
			setList(asteroids)
		}
	}, [val])

	return <div className="list">
		<table>
			<thead>
				<tr>
					<th>Name</th>
					<th>Minerals</th>
					<th>Current miner</th>
					<th>Position (x, y)</th>
				</tr>
			</thead>

			<tbody>
				{
					list.map((item) => (
						<tr key={item._id}>
							<td>{item.name}</td>
							<td className={item.curMinerals === 0 ? "red" : ""}>{item.curMinerals}/{item.minerals}</td>
							<td>{item.miners?.length || "-"}</td>
							<td>{item.position.x},{item.position.y}</td>
						</tr>
					))
				}
			</tbody>
		</table>
	</div>
}

export default AsteroidList