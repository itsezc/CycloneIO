import React, { Component } from 'react'
import Script from 'react-load-script'

import '../client/index.styl'

import Wallet from '../../components/wallet'
import Toolbar from '../../components/toolbar'

export default class Room extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<div className='client'>
				<Script url='http://localhost:8080/client.min.js' />

				<div className='room' id='game'></div>

				{/* <Wallet /> */}
				<Toolbar isClient={true} />
			</div>
		)
	}
}