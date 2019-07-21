import React, { Component } from 'react'

import './index.styl'

// import Wallet from '../../components/wallet'
// import Toolbar from '../../components/toolbar'

// import Catalog from '../../components/dialogs/catalog'

// import Actions from '../../components/actions'
// import Chat from '../../components/chat/bubble'
// import Chatbox from '../../components/chatbox'

// import Moderation from '../../components/dialogs/moderation'

// import Inventory from '../../components/dialogs/inventory'

// import Poll from '../../components/poll'

import {Engine} from '../../../../../client/games/game'


export default class Room extends Component<any, any> {

	private engine: Engine
	private roomData: any

	constructor(props: any) {
		super(props)
	}

	componentDidMount()
	{
		this.engine = new Engine('game')
		this.props.socket.on('playerJoined', (data: any) => {
			this.engine.joinPlayer(data)
		})
	}

	componentWillReceiveProps(nextProps: any) {

		if(!this.roomData || this.roomData.id !== nextProps.roomData.id){
			this.roomData = nextProps.roomData
			this.engine.gotoRoom(nextProps.roomData)
		}
		
	}

	render() {
		return(
			<div className='client'>
				{/* <Actions /> */}

				<div className='room' id='game'></div>

				{/* <Moderation />
				<Chatbox /> */}

				{/* <Inventory /> */}
				
				{/* <Catalog /> */}

				{/* <Poll question='Cyclone or Habbo' status={false} /> */}
				{/* <Chat
					name='EZ-C'
					avatar='https://cdn.discordapp.com/attachments/557261127847772161/577965083905359892/Screenshot_from_2019-05-14_23-02-49.png'
					type='shout'
					style={2}
					message='This is an example message'
				/> */}
				{/* <Wallet />
				<Toolbar isClient={true} /> */}
			</div>
		)
	}
}