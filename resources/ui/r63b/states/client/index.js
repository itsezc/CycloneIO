import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import Wallet from '../../components/wallet'
import Alert from '../../components/alert'
import Catalog from '../../components/catalog/catalog'
import Moderation from '../../components/moderation'

import './client.styl'

export default class Client extends Component {

	constructor(props) {
		super(props)

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

					<div className='hotel'>

						<Moderation />
						<Catalog />
						<Alert
							title='Message from Habbay Hotel'
							message='This is a text message, except that it is a very long text message even so that it takes a few lines, which is pretty surprising because its our very first element, so Enjoy!'
							author='EZ-C'
						/>

						<Wallet />
					</div>

					<div className='toolbar'>
						<div className='more'>
							<img src="https://github.com/TheNamesRay/Habbo-in-HTML5/blob/master/assets/images/hotelview/barIcons/arrow.png?raw=true" />
						</div>
						<div className='icons'>
							<span className='house'></span>
							<span className='rooms'></span>
							<span className='catalogue-icon'></span>
							<span className='builders-club'></span>
							<span className='inventory'></span>
							<span className='user'>
								<img src='https://www.habbo.com.tr/habbo-imaging/avatarimage?figure=fa-3276-1331.he-8394-1408.sh-725-1408.hd-600-1383.ch-691-1428.lg-710-110.ca-1815-1408.ha-3763-63.hr-834-54&size=n&direction=2&head_direction=2&crr=3&gesture=sml&frame=3' />
							</span>
						</div>

						<div className='friends'>
							<div className='icons'>
								<span className='all'></span>
								<span className='search'></span>
							</div>

							<div className='slots'>
								<div className='slot'>
									<img src="https://github.com/TheNamesRay/Habbo-in-HTML5/blob/master/assets/images/hotelview/barIcons/friend_head.png?raw=true" />
									Find new <br />friends
								</div>
								<div className='slot'>
									<img src="https://github.com/TheNamesRay/Habbo-in-HTML5/blob/master/assets/images/hotelview/barIcons/friend_head.png?raw=true" />
									Find new <br />friends
								</div>
								<div className='slot'>
									<img src="https://github.com/TheNamesRay/Habbo-in-HTML5/blob/master/assets/images/hotelview/barIcons/friend_head.png?raw=true" />
									Find new <br />friends
								</div>
							</div>
							<div className='more more-friends'>
								<img src="https://github.com/TheNamesRay/Habbo-in-HTML5/blob/master/assets/images/hotelview/barIcons/arrow.png?raw=true" />
							</div>
						</div>
					</div>

				</div>
			)
		}

	}
}
