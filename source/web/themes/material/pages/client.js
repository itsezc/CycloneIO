import React, { Component } from 'react'


class Register extends Component {
	componentDidMount() {
		window.PhaserGlobal = {
			hideBanner: true
		}
	}

	render() {
		return (
			<div>
				<script src='./client.js'></script>
			</div>
		)
	}
}

export default Register
