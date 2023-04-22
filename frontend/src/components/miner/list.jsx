/**
 * List of miners
 */

import React, { useState, useContext, useEffect } from 'react'
import Rodal from 'rodal'

import { WebsocketContext } from '../../context/websocket.jsx'
import PopupContent from './popup.jsx'
import Loader from '../layout/loader.jsx'

const MinerList = () => {
	const [ready, val, emit] = useContext(WebsocketContext);
	const [list, setList] = useState([])
	const [selectedMiner, setSelectedMiner] = useState(0)
	const [popupVisible, setPopupVisible] = useState(false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (ready) {
			emit('miner', {
				action: 'getList'
			})
			setLoading(true)
		}

	}, [ready]);

	useEffect(() => {
		if (val) {
			setLoading(false)
			if (val.type === 'miner' && val.action === 'getList') {
				setList(val.data)
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
						<tr key={`miner-${idx}`} onClick={() => {
							setPopupVisible(true)
							setSelectedMiner(miner.id)
						}}>
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

		<Rodal visible={popupVisible} onClose={() => setPopupVisible(false)} width={782} height={480}>
			<h2>History of Miner 1</h2>
			{
				loading ? <Loader /> : popupVisible && <PopupContent minerId={selectedMiner} />
			}
		</Rodal>
	</div>

}

export default MinerList