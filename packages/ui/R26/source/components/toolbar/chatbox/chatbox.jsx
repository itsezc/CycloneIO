import React, { Component } from 'react'

export default class ChatBox extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<input className='chatbox' type='text' placeholder='test..' />
		)
	}
}

