import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

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
}

export default class Client extends Component<any, ClientState>
{
	private database: ApolloClient<any>

	constructor(props: any) {
		super(props)

		this.database = new ApolloClient({
			uri: 'http://localhost:8081/graphql'
		})

		this.state = {
			loaded: true
		}
	}

	render() {

		if (this.state.loaded == false) {
			return (
				<Redirect to='/' />
			)
		} else {
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

						{/* <Poll 
							question='Habbo or Cyclone'
							status={false}
						/> */}

						{/* <Moderation />*/}

						<ApolloProvider client={this.database}>
							<Navigator />
						</ApolloProvider>
						

						{/* <Catalog /> */}

						<Alert
							title='Message from Habbay Hotel'
							message='This is a text message, except that it is a very long text message even so that it takes a few lines, which is pretty surprising because its our very first element, so Enjoy!'
							author='EZ-C'
						/>

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
		}

	}
}
