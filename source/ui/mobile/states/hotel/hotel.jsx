// @@PROD
// Export from Expo once ready for prod

import React, { Component } from 'react'

import './hotel.styl'

export default class Hotel extends Component 
{
	constructor(props) {
		super(props)

		this.state = {
			connected: true,
			loggedIn: true 
		}
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
						.navigation
							img.avatar(src='https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=EZ-C&headonly=1&direction=2&head_direction=3&action=&gesture=&size=l')
			`
		)
	}
}