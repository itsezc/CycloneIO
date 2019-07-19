import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import ScrollBar from '../../helpers/scrollbar'
import ProgressBar from '../../helpers/progress/bar'

import Actions from '../../components/actions'
import Toolbar from '../../components/toolbar'
import Explorer from '../../components/explorer'

// import Notifications from '../../components/notifications'

import Poll from '../../components/poll'

import Alert from '../../components/dialogs/alert'
import Catalog from '../../components/dialogs/catalog'
import Navigator from '../../components/dialogs/navigator'

import Moderation from '../../components/dialogs/moderation'

import Chat from '../../components/chat/bubble'

import Wallet from '../../components/wallet'

import ApolloClient from 'apollo-boost' 
import { ApolloProvider } from 'react-apollo'

import './index.styl'

type ClientState = {
	loaded: boolean
	connected?: boolean
}

export default class GameCenter extends Component<any, ClientState>
{
	private Database: ApolloClient<any>
	private Socket: SocketIOClient.Socket

	private connected: boolean
	private tmp: any

	constructor(props: any) {
		super(props)

		// this.Database = new ApolloClient({
		// 	uri: 'http://localhost:8087/graphql'
		// })

		this.state = {
			connected: true,
			loaded: true
		}
	}

	render() {
		if(this.state.connected) 
		{
			return(
				<div className='client'>

					<Actions />

					<div className='hotel'>
						<Wallet />
						
						{/* <Moderation />*/}

						{/* <ApolloProvider client={this.Database}> */}
							{/* <Navigator /> */}

							{/* <Catalog /> */}
						{/* </ApolloProvider> */}

						{/* <Alert
							title='Message from Cyclone Hotel'
							message='This is a text message, except that it is a very long text message even so that it takes a few lines, which is pretty surprising because its our very first element, so Enjoy!'
							author='EZ-C'
						/> */}

						{/* {this.tmp} */}
			
						{/* <Explorer type='furniture' name='Throne' /> */}

						{/* <Chat
							name='EZ-C'
							avatar='https://cdn.discordapp.com/attachments/557261127847772161/577965083905359892/Screenshot_from_2019-05-14_23-02-49.png'
							type='shout'
							style={2}
							message='This is an example message'
						/> */}
						
						{/* <Notifications /> */}
					</div>
					
					<Toolbar isClient={false} />
				</div>
			)

		} else {
			return(
				<div>It doesn't works or its loading idk</div> 
			)
		}

		// // if(this.connected === true) {
		// // 	console.log(this.tmp)
		// 	if (this.state.loaded == false) {
		// 		return (
		// 			<Redirect to='/' />
		// 		)
		// 	} else {
		//	}
		
		// }

	}
}
