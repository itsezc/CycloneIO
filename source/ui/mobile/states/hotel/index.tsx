import React, { Component } from 'react'

import './hotel.styl'

import Button from '../../components/button'
import Wallet from '../../components/wallet'

export default class Hotel extends Component {
	
	private currencies: {}[]
	
	constructor(props: any) {
		super(props)

		this.state = {
			connected: true,
			loggedIn: true 
		}

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

					{/* <Wallet currencies={this.currencies} /> */}

					<div className='container'>
						<h1>What's up DaddyChiru?</h1>
						<div className='actions'>
							<div className='action'>
								<img className='icon' src='' />
								<span>Find a room</span>
							</div>
							<div className='action'>
								<img className='icon' src='' />
								<span>Check out the news</span>
							</div>
							<div className='action'>
								<img className='icon' src='' />
								<span>Go shopping</span>
							</div>
							<p>Cyclone (Build 0.0.1)</p>
						</div>
					</div>

					<div className='navigation'>
						<img className='avatar' src='https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=EZ-C&headonly=1&direction=2&head_direction=3&action=&gesture=&size=l' />
					</div>
				</div>
			</div>
		)
	}
}