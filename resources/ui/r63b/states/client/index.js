import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

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
					<div className='hotel'></div>
					<div className='toolbar'></div>
				</div>
			)
		}

	}
}
