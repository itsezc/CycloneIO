import React, { Component } from 'react'

import './hotel.styl'

import Button from '../../components/button/index.jsx'
import Wallet from '../../components/wallet/index.jsx'

export default class Hotel extends Component {
	
	private currencies: {}[]
	
	constructor(props: any) {
		super(props)

		this.state = {
			connected: true,
			loggedIn: true 
		}

		/**
		 * Database (Rooms) 
		 * User enters a room (ID: 5)
		 * Room[5] => Users 1 view
		 * Navigator[0] = Room[5] has 1 user
		 * 5 users go into the room (5 users)
		 */

 		// userCheckAuth() => getCurrencies[ID] (ApolloClient!)
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
			<div className='client'>
				<div className='hotel'>
					<img className='icon' src='https://upload.wikimedia.org/wikipedia/commons/8/80/SemihReiz.png' />
					<Wallet currencies={this.currencies} />
					<div className='container'>
						<h1>What's up EZ-C?</h1>
					</div>
					<div className='navigation'>
						<img className='avatar' src='https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=EZ-C&headonly=1&direction=2&head_direction=3&action=&gesture=&size=l' />
					</div>

				</div>
			</div>
		)
	}
}