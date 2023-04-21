/**
 * List of miners
 */

import React, { useState, useContext, useEffect } from 'react'
import Rodal from 'rodal'

import { WebsocketContext } from '../../context/websocket.context.js'
import PopupContent from './popup.jsx'
import Loader from '../layout/loader.jsx'

const MinerList = () => {
	const [ready, val, send] = useContext(WebsocketContext);
	const [list, setList] = useState([])
	// const [popupVisible, setPopupVisible] = useState(false)
	// const [loading, setLoading] = useState(false)

	useEffect(() => {
		console.log('list', ready)
		if (ready) {
			send(JSON.stringify({
				type: 'miner',
				action: 'getList'
			}))
		}

	  }, [ready]);

	  useEffect(() => {
		if (val) {
			const res = JSON.parse(val)

			if (res.type === 'miner' && res.action === 'getList') {
				setList(res.data)
			}
		}
	  }, [val])

	
	return <div className="list">
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Planet</th>
						<th>Carry capacity</th>
						<th>Travel speed</th>
						<th>Mining speed</th>
						<th>Position (x, y)</th>
						<th>Status</th>
					</tr>
				</thead>

				<tbody>
	  				{
						list.map((miner, idx) => (
							<tr key={`miner-${idx}`}>
								<td>{miner.name}</td>
								<td>Planet {miner.planetId}</td>
								<td>{miner.carryCapacity}/120</td>
								<td>{miner.travelSpeed}</td>
								<td>{miner.miningSpeed}</td>
								<td>{miner.position ? `${miner.position.x},${miner.position.y}` : 'not assigned'}</td>
								<td>{miner.status}</td>
							</tr>
						))
					}
				</tbody>
			</table>

			{/* <Rodal visible={popupVisible} onClose={() => setPopupVisible(false)} width={782} height={480}>
				<h2>History of Miner 1</h2>
				{
					this.state.loading ? <Loader /> : <PopupContent />
				}
			</Rodal> */}
		</div>

}

export default MinerList