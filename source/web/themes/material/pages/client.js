import React, { Component } from 'react'


class Register extends Component {
	componentDidMount() {
		const script = document.createElement('script');

        script.src = '/web-build/dist/client.min.js';
        script.async = true;

        document.body.appendChild(script);

		window.PhaserGlobal = {
			hideBanner: true
		}
	}

	render() {
		return (
			<div></div>
		)
	}
}

export default Register
