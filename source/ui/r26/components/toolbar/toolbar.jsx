import React, { Component } from 'react' 

import ChatBox from './chatbox/chatbox.jsx'

export default class Toolbar extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className='toolbar bottom'>
				<ChatBox />
			</div>
		)
	}
}