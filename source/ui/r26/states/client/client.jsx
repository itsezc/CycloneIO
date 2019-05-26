import React, { Component } from 'react'

import './client.styl'
import '../../components/index.styl'

import Header from '../../components/toolbar/header.jsx'
import Toolbar from '../../components/toolbar/toolbar.jsx'

export default class Client extends Component {
	render() {
		return(
			<div className='client'>
				<Header />
				This da client
				<Toolbar />
			</div>
		)
	}
}