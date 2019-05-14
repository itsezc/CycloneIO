import React, { Component } from 'react'

import Header from '../layouts/header'
import Footer from '../layouts/footer'

import '../styles/base.css'

export default class Index extends Component {
	render() {
		return(
			pug`
				div.content
					Header
					Footer
			`
		)
	}
}