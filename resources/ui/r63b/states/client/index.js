import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import Actions from '../../components/actions'
import Toolbar from '../../components/toolbar'
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

					<Actions />

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

					
					<Toolbar />
				</div>
			)
		}

	}
}
