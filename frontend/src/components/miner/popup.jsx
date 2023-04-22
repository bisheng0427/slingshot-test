/**
 * Miner popup
 */

import React, { useState, useEffect, useContext } from 'react'
import Loader from '../layout/loader.jsx'
import { WebsocketContext } from '../../context/websocket.jsx'


const MinerPopup = (props) => {
	const { minerId } = props
	const [loading, setLoading] = useState(false)
	const [list, setList] = useState([])
	const [ready, val, emit] = useContext(WebsocketContext);

	// init, fetch history info
	useEffect(() => {
		console.log('history', minerId, ready)
		if (ready && minerId > 0) {
			emit('minerHistory', {
				action: 'getList',
				payLoad: {
					minerId
				}
			})
			setLoading(true)
		}

	}, [ready]);

	// render history info
	useEffect(() => {
		if (val) {
			setLoading(false)
			if (val.type === 'minerHistory' && val.action === 'getList') {
				setList(val.data)
			}
		}
	}, [val])

	return <div className="scrollable">
		<table>
			<thead>
				<tr>
					<th>Date</th>
					<th>Year</th>
					<th>Planet</th>
					<th>Carry capacity</th>
					<th>Travel speed</th>
					<th>Mining speed</th>
					<th>Position (x, y)</th>
					<th>Status</th>
				</tr>
			</thead>

			<tbody>
				{/* {loading && <Loader />} */}
				{/* {list.map((item) => (
					<tr key={item.id}>
						<td>{item.date}</td>
						<td>{item.year}</td>
						<td>{item.planet}</td>
						<td>{item.carryCapacity}</td>
						<td>{item.travelSpeed}</td>
						<td>{item.miningSpeed}</td>
						<td>{item.position.x}, {item.position.y}</td>
						<td>{item.status}</td>
					</tr>
				))} */}

			</tbody>
		</table>
	</div>
}

export default MinerPopup