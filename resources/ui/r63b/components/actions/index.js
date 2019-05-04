import React, { Component } from 'react'
import { fullScreen } from '../../utils/class.functions'

export default class Actions extends Component {
	constructor(props) {
		super(props)

		this.state = {
			fullScreen: false
		}
	}

	toggleFullscreen = event => {
		fullScreen(this.state.fullScreen)
		this.state.fullScreen = this.state.fullScreen ? this.setState({ fullScreen: false }) : this.setState({ fullScreen: true })
	}
 
	render() {
		return (
			<div className='actions'>
				<button className='action'>WEB</button>
				<button className='action' onClick={this.toggleFullscreen}>FS</button>
			</div>
		)
	}
}