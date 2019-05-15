import React, { Component } from 'react'

// import Header from '../layouts/header.jsx'
// import Footer from '../layouts/footer.jsx'
import Test from '../layouts/test.jsx'
import '../styles/index.styl'

//import '../styles/base.css'

export default class Client extends Component {
	
	loadJS(src, test, callback) {
		let script = document.createElement('script')
		script.src = src
		document.body.appendChild(script)

		let callbackTimer = setInterval(() => {
			let call = false 

			try {
				call = test.call()
			} catch(e) {}

			if(call) {
				clearInterval(callbackTimer)
				callback.call()
			}
		}, 100)
	}

	componentDidMount() {
		this.loadJS('//cdn.jsdelivr.net/npm/phaser@3.17.0/dist/phaser.min.js', function() {
			return(Phaser !== 'undefined')
		}, () => {
			this.loadJS('//cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.dev.js', function() {
				return(io !== 'undefined')
			}, () => {
				const script = document.createElement('script')
				script.src = 'http://localhost:8080/client.min.js'
				document.body.appendChild(script)
			})
		})
	}
	
	render() {
		return(
			pug`
				div
			`			
		)
	}
}