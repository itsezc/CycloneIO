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
				<Script url='https://cdnjs.cloudflare.com/ajax/libs/phaser/3.17.0/phaser.min.js' />
				<Script url='https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js' />
				<Script url='/dist/client.min.js' />


				{/* <Wallet /> */}
				<Toolbar isClient={true} />
			</div>
		)
	}
}