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

					<div className='gameparent'>
						<Wallet />
						
						<div className='gamecontainer'>

							<div className='game__container__content'>
								<p>Ready, Set... GO!</p>
								<img src='/games/speedway/logo.png' className='logo' />
								<div className='description'>
									Strap yourself in for some slotcar carnage, Race the track against friends, <br /> use a variety of power-ups to reach pole position and take some gold.
								</div>

								<button className='illumina-button'>
									Play Now
								</button>
							</div>

							<div className='banner'>
								<img src='/games/speedway/banner.png'/>
							</div>
						</div>
					</div>
					<div className='picker'>
						<fieldset className='inner'>
							<legend className='title'>SELECT GAME</legend>
							<div className='content'>

								<div className='game'>
									<img src='/games/fastfood/icon.png' />
								</div>

								<div className='game'>
									<img src='/games/snowstorm/icon.png' />
								</div>

								<div className='game'>
									<img src='/games/speedway/icon.png' className='selected' />
								</div>

								<div className='game'>
									<img src='/games/streetz/icon.png' />
								</div>

								<div className='game'>
									<img src='/games/turku/icon.png' />
								</div>
							</div>
						</fieldset>
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
