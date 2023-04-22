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
				payload: {
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
					<th>Year</th>
					<th>Position (x, y)</th>
					<th>Action</th>
					<th>Status</th>
				</tr>
			</thead>

			<tbody>
				{/* {loading && <Loader />} */}
				{list.map((item) => (
					<tr key={item.id}>
						<td>{item.year}</td>
						<td>{item.position.x}, {item.position.y}</td>
						<td>{item.action}</td>
						<td>{item.status}</td>
					</tr>
				))}

			</tbody>
		</table>
	</div>
}

export default MinerPopup