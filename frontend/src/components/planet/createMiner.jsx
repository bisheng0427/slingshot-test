/**
 * Create miner popup
 */

import React, { useState, useContext, useEffect } from 'react'
import { WebsocketContext } from '../../context/websocket';

const CreateMiner = (props) => {
	const limit = 120
	const [ready, val, emit] = useContext(WebsocketContext);
	const [totalPoints, setToalPoints] = useState(0)
	const [info, setInfo] = useState('')
	const [miner, setMiner] = useState({
		planetId: 1,
		position: props.position,
		name: '',
		carryCapacity: 0,
		travelSpeed: 0,
		miningSpeed: 0,
		limit: 120
	})

	const updateField = (field, val) => {
		const temp = Object.assign({}, miner)
		if (field !== 'name') val = Number(val)
		temp[field] = val
		console.log(temp)
		setToalPoints(Number(temp.carryCapacity) + Number(temp.travelSpeed) + Number(temp.miningSpeed))
		setMiner({ ...temp })
	}

	const submit = () => {
		if (ready) {
			emit('planet', {
				action: 'spawnMiner',
				payload: miner
			})
		}
	}

	useEffect(() => {
		if (val) {
			if (val.success) {
				setInfo('success')
			} else {
				setInfo(val.message)
			}
		}
	}, [val]);

	return (
		<form>
			<div className="field error">
				<label for="name">Miner name</label>
				<input type="text" id="name" placeholder="Miner name" onChange={(e) => updateField('name', e.target.value)} />
			</div>

			<div className="field">
				<label for="planet">Planet</label>
				<select placeholder="Select a planet" id="planet" defaultValue="1" onChange={(e) => updateField('planetId', e.target.value)}>
					<option value="1">Planet 1</option>
					<option value="2">Planet 2</option>
					<option value="3">Planet 3</option>
				</select>
			</div>

			<h2>Assign points</h2>

			<div className="columns">
				<div className="column">
					<div className="field">
						<label for="carry-capacity">Carry capacity</label>
						<input value={miner.carryCapacity} type="number" id="carry-capacity" placeholder="0" onChange={(e) => updateField('carryCapacity', e.target.value)} />
					</div>
				</div>
				<div className="column">
					<div className="field">
						<label for="travel-speed">Travel speed</label>
						<input value={miner.travelSpeed} type="number" id="travel-speed" placeholder="0" onChange={(e) => updateField('travelSpeed', e.target.value)} />
					</div>
				</div>
				<div className="column">
					<div className="field">
						<label for="mining-speed">Mining speed</label>
						<input value={miner.miningSpeed} type="number" id="mining-speed" placeholder="0" onChange={(e) => updateField('miningSpeed', e.target.value)} />
					</div>
				</div>
			</div>

			<div className={totalPoints <= limit ? 'green' : 'red'}>{totalPoints}/{limit}</div>
			<div className="actions">
				<button onClick={() => submit()}>Save</button>
			</div>
			<h2>{info}</h2>
		</form>
	)
}

export default CreateMiner