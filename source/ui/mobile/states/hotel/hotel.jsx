// @@PROD
// Export from Expo once ready for prod

import React, { Component } from 'react'

import './hotel.styl'

import Button from '../../components/button/index.jsx'
import Wallet from '../../components/wallet/index.jsx'

export default class Hotel extends Component 
{
	constructor(props) {
		super(props)

		this.state = {
			connected: true,
			loggedIn: true 
		}

		this.currencies = [
			{ name: 'Credits', amount: 500  },
			{ name: 'Duckets ', amount: 100 },
			{ name: 'Diamonds', amount: 50 },
			{ name: 'HC', amount: 5 },
			{ name: 'BC', amount: 10 }
		]
	}

	login()
	{
		//..
		// on Success
		this.setState({
			loggedIn: true
		})
	}

	logout() 
	{
		this.setState({
			loggedIn: false
		})
	}


	render() {
		return (
			pug`
				.client
					.hotel
						img.icon(src='https://upload.wikimedia.org/wikipedia/commons/8/80/SemihReiz.png')
						// Wallet(currencies=${this.currencies})
						.container
							h1 What's up EZ-C?
						.navigation
							img.avatar(src='https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=EZ-C&headonly=1&direction=2&head_direction=3&action=&gesture=&size=l')
							.news T

			
			`
		)
	}
}