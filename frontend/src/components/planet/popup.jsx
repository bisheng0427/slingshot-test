/**
 * Planet popup
 */

import React from 'react'

class PlanetPopup extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
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
					<tr>
						<td>Miner 1</td>
						<td>0/120</td>
						<td>60</td>
						<td>20</td>
						<td>832, 635</td>
						<td>Mining</td>
					</tr>

					<tr>
						<td>Miner 2</td>
						<td>16/120</td>
						<td>200</td>
						<td>45</td>
						<td>32, 205</td>
						<td>Traveling</td>
					</tr>

					<tr>
						<td>Miner 3</td>
						<td className="green">120/120</td>
						<td>87</td>
						<td>166</td>
						<td>333, 123</td>
						<td>Transferring</td>
					</tr>
				</tbody>
			</table>
		</div>
	}
}

export default PlanetPopup