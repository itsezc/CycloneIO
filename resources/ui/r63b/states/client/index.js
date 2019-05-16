import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import Actions from '../../components/actions'
import Toolbar from '../../components/toolbar'
import Wallet from '../../components/wallet'

import Alert from '../../components/alert/alert.jsx'
import Catalog from '../../components/catalog/catalog'
import Moderation from '../../components/moderation'

import Navigator from '../../components/navigator'

import Chat from '../../components/chat/bubble.jsx'

import ApolloClient, { gql } from 'apollo-boost' 
import { ApolloProvider, Query } from 'react-apollo'

import './client.styl'

export default class Client extends Component {

	constructor(props) {
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

						<i className='hotel-logo'></i>

						<Moderation />

						<Catalog /> 

						<Alert
							title='Message from Habbay Hotel'
							message='This is a text message, except that it is a very long text message even so that it takes a few lines, which is pretty surprising because its our very first element, so Enjoy!'
							author='EZ-C'
						/>

						<Chat
							name='EZ-C'
							avatar='https://cdn.discordapp.com/attachments/557261127847772161/577965083905359892/Screenshot_from_2019-05-14_23-02-49.png'
							type='shout'
							style={2}
							message='This is an example message'
						/>

						<Wallet />
					</div>

					
					<Toolbar />
				</div>
			)
		}

	}
}
