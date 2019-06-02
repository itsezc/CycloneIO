import React, { Component } from 'react'

import './index.styl'

export default class Client extends Component {
	render() {
		return(
			<div className='client'>
				<div className='room' id='game'>
					<img className='icon' src='https://upload.wikimedia.org/wikipedia/commons/8/80/SemihReiz.png' />
				</div>
			</div>
		)
	}
}