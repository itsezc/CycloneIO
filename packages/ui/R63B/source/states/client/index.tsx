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
import Inventory from '../../components/dialogs/inventory'

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

export default class Client extends Component<any, ClientState>
{
	private Database: ApolloClient<any>
	private Socket: SocketIOClient.Socket

	private connected: boolean
	private tmp: any

	constructor(props: any) {
		super(props)

		this.Database = new ApolloClient({
			uri: 'http://localhost:8087/graphql'
		})

		this.Socket = props.socket
		this.Socket.emit('requestHotelView')
		this.Socket.on('renderHotelView', () => {
			// this.tmp = <Alert
			// 	title='Message from Cyclone Hotel'
			// 	message='This is a text message, except that it is a very long text message even so that it takes a few lines, which is pretty surprising because its our very first element, so Enjoy!'
			// 	author='EZ-C'
			// />
			this.setState({ connected: true })
		})

		this.Socket.emit('getRoom', 'cjy1pitya00ik0772bhv2sglx');
		this.Socket.on('setRoom', (data: any) => {
			console.log(data)
		})

		this.state = {
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

						<div className='bonus'>
							<img className='thumbnail' src='/hotelview/bonus_sack.png' />
							<div className='offer'>
								<h2>Bonus Bag 1 every 120 credits!</h2>
								<ProgressBar value={55} max={100} />
							</div>
							<div className='subscribe'>
								<button className='illumina subscribe button'>Get Credits</button>
							</div>
						</div>

						<div className='campaigns'>

							<div className='campaign'>
								<img src='/hotelview/campaigns/spromo_rainbow19_summergifts.png' />
								<div className='content'>
									<span>
										<h1>Open Your Summer Calendar!</h1>
										<p>Between the 1st and 31st of July, every day you will receive a free gift from your summer Calendar. Open yours now!</p>
									</span>
									<button className='illumina button'>Open it!</button>
								</div>
							</div>

							<div className='campaign small'>
								<div className='content'>
									<span>
										<h1>NEW: Celestial Bundle</h1>
										<p>We're extremely happy to present the brand new, 100% exclusive Celestial Bundle! Comes with exclusive badge.</p>
									</span>
									<button className='illumina button'>See the bundle!</button>
								</div>
							</div>


							<div className='campaign'>
								<img src='/hotelview/campaigns/spromo_underwater_house_bundle.png' />
								<div className='content'>
									<span>
										<h1>Underwater House Bundle</h1>
										<p>Now that you've travelled all the way to the Coral Kingdom, make sure you buy a house there! Comes with exclusive badge. Bundle built by Jenneben (NL)</p>
									</span>
									<button className='illumina button'>See the rare!</button>
								</div>
							</div>


							<div className='campaign small'>
								<div className='content'>
									<span>
										<h1>NEW: Pride Furni!</h1>
										<p>To celeberate Pride in Cyclone, we're releasing a set of rainbow-coloured bedroom furni for you all!</p>
									</span>
									<button className='illumina button'>See the furni!</button>
								</div>
							</div>

						</div>

						{/* <Poll 
							question='Habbo or Cyclone'
							status={false}
						/> */}

						{/* <Moderation />*/}

						<Inventory />

						<ApolloProvider client={this.Database}>
							{/* <Navigator /> */}

							<Catalog />
						</ApolloProvider>

						{/* <Alert
							title='Message from Cyclone Hotel'
							message='This is a text message, except that it is a very long text message even so that it takes a few lines, which is pretty surprising because its our very first element, so Enjoy!'
							author='EZ-C'
						/> */}

						{this.tmp}

						<Wallet />

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
