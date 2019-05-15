import React, { Component } from 'react'

export default class ChatBubble extends Component {
	constructor(props) {
		super(props)

		this.type = props.type
		this.avatar = props.avatar
		this.message = props.message
		this.name = (props.name || 'User').concat(':', ' ')
	}

	render() {
		return(
			<div className='chat'>
				<span className='avatar'>
					<img src={this.avatar} />
				</span>
				<div className='body'>
					<div className='wrapper'>
						<span className='name'>{this.name}</span>
						<p className='message'>{this.message}</p>
					</div>
				</div>
				<span class='close'></span>
			</div>
		)
	}
}