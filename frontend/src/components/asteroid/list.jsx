/**
 * List of asteroids
 */

import React from 'react'

class AsteroidList extends React.Component {
	constructor(props) {
		super(props)
	}

	render() {
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
					<tr>
						<td>Asteroid 1</td>
						<td>758/963</td>
						<td>Miner 1</td>
						<td>832, 635</td>
					</tr>

					<tr>
						<td>Asteroid 2</td>
						<td className="red">0/879</td>
						<td>-</td>
						<td>759, 118</td>
					</tr>

					<tr>
						<td>Asteroid 3</td>
						<td>915/1157</td>
						<td>Miner 2</td>
						<td>216, 492</td>
					</tr>

					<tr>
						<td>Asteroid 4</td>
						<td>2/989</td>
						<td>Miner 4</td>
						<td>564, 349</td>
					</tr>

					<tr>
						<td>Asteroid 5</td>
						<td>702/905</td>
						<td>-</td>
						<td>255, 255</td>
					</tr>
				</tbody>
			</table>
		</div>
	}
}

export default AsteroidList