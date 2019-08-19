import React, { Component } from 'react'

import './index.styl'

import Wallet from '../../components/wallet'
import Toolbar from '../../components/toolbar'

import Catalog from '../../components/dialogs/catalog'

import Actions from '../../components/actions'
import Chat from '../../components/chat/bubble'
import Chatbox from '../../components/chatbox'

import Moderation from '../../components/dialogs/moderation'

import Inventory from '../../components/dialogs/inventory'

import Poll from '../../components/poll'

import ClickActions from '../../components/click-actions'

import Habbo from '../../../../../client/Habbo'

import FurnitureInfos from '../../components/click-infos/furniture'
import UserInfos from '../../components/click-infos/user'
import BotInfos from '../../components/click-infos/bot'
import { Input } from 'phaser'


export default class Room extends Component<any, any> {

	private engine: Habbo

	private readonly Socket: SocketIOClient.Socket

	private roomMessages: any

	public constructor(props: any) {
		super(props)

		this.state = {
			chatbox: '',
			messages: [],
			roomMessages: []
		}

		this.Socket = props.socket

		this.Socket.on('recieveRoomChat', (data: any) => {
			
			this.state.messages.push(data)
			console.log('Got data', this.state.messages)

			this.setState({
				roomMessages: this.state.messages.map((message: any, index: number) => {
					return (
						<Chat
							key={index}
							name={message.from}
							avatar='https://cdn.discordapp.com/attachments/557261127847772161/577965083905359892/Screenshot_from_2019-05-14_23-02-49.png'
							type='shout'
							style={2}
							message={message.body}
						/>
					)
				})
			})
		})
	}

	public componentDidMount(){
		this.engine = new Habbo('game', this.props.socket)

		/*this.engine.init().then(() => {
			console.log('Game initialized')
			this.Socket.emit('joinRoom', 'cjyt6bnil00940791ljww2ya7')
		})*/

	}

	public render() {
		return(
			<div className='client room'>
				<Actions />

				<div className='room' id='game'></div>

				<Moderation />
				<Chatbox
					socket={this.Socket}
				/>

				<div className="click-infos">
					<UserInfos />
				</div>

				{/* <ClickActions
					isOwn={true}
				/> */}

				{/* <Inventory /> */}
				
				<div className='chat__bubbles'>
					{this.state.roomMessages}
				</div>
					
				{/* <Catalog /> */}

				{/* <Poll question='Cyclone or Habbo' status={false} /> */}

				<Wallet />
				<Toolbar isClient={true} />
			</div>
		)
	}
}
