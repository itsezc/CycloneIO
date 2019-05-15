import React, { Component } from 'react'

// import Header from '../layouts/header.jsx'
// import Footer from '../layouts/footer.jsx'
import Test from '../layouts/test.jsx'
import '../styles/index.styles'

//import '../styles/base.css'

export default class Index extends Component {
	render() {
		return(
			pug`
				Test
				// .content
				// 	Header(name='Title')
				// 	Footer
			`			
		)
	}
}