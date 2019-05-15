import React, { Component } from 'react'

export default class ChatBubble extends Component {
	constructor(props) {
		super(props)

		this.type = props.type || 'say'
		this.style = props.style
		this.avatar = props.avatar
		this.name = (props.name || 'User').concat(':', ' ')
		this.message = props.message
	}

	render() {
		return(
			<div className='chat'>
				<span className='avatar'>
					<img src={this.avatar} />
				</span>
				<div className='body'>
					<div className='wrapper'>
						<span className={`name ${this.type}`}>{this.name}</span>
						<p className={`message ${this.type}`}>{this.message}</p>
					</div>
				</div>
				<span className='close'></span>
				<span className='arrow'>&nbsp;</span>
			</div>
		)
	}
}