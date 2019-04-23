import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'


import Alert from '../../components/alert'
import Catalog from '../../components/catalog/catalog'

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

						<Alert
							title='Message from Habbay Hotel'
							message='This is a text message, except that it is a very long text message even so that it takes a few lines, which is pretty surprising because its our very first element, so Enjoy!'
							author='EZ-C'
						/>

						<Catalog />

						<div className='purse'>
							<ul className='currencies'>
								<li className='currency credits'>
									1000 <i className='icon credits'></i>
								</li>
								<li className='currency duckets'>
									1000 <i className='icon duckets'></i>
								</li>
								<li className='currency diamonds'>
									1000 <i className='icon diamonds'></i>
								</li>
							</ul>
							<span className='club'>
								<i className='icon hc'></i>
								<p>Join</p>
							</span>
							<ul className='buttons'>
								<li className="window-manager-button blue"><a>Help</a></li>
								<li className="window-manager-button red"><a><i className="icon-logout"></i></a></li>
								<li className="window-manager-button purple"><a><i className="icon-settings"></i></a></li>
							</ul>

						</div>

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
