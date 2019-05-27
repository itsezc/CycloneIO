import React, { Component } from 'react'
import Script from 'react-load-script'

import '../client/index.styl'

import Wallet from '../../components/wallet/index.jsx'
import Toolbar from '../../components/toolbar/index.jsx'

import Catalog from '../../components/dialogs/catalog/index.jsx'

import Actions from '../../components/actions/index.jsx'
import Chat from '../../components/chat/bubble.jsx'

import Moderation from '../../components/dialogs/moderation/index.jsx'

import Poll from '../../components/poll/poll.jsx'

export default class Room extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<div className='client'>
				<Actions />

				<div className='room' id='game'></div>

				<Moderation />

				<Catalog />

				{/* <Poll question='Cyclone or Habbo' status={false} /> */}
				<Chat
					name='EZ-C'
					avatar='https://cdn.discordapp.com/attachments/557261127847772161/577965083905359892/Screenshot_from_2019-05-14_23-02-49.png'
					type='shout'
					style={2}
					message='This is an example message'
				/>
				<Wallet />
				<Toolbar isClient={true} />
			</div>
		)
	}
}