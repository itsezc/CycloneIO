import React, { Component } from 'react'

import Header from '../layouts/header.jsx'
import Footer from '../layouts/footer.jsx'

import '../styles/base.css'

export default class Index extends Component {
	render() {
		return(
			pug`
				.content
					Header(name='Title')
					Footer
			`			
		)
	}
}