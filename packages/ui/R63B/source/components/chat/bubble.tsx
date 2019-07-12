import React, { Component } from 'react'

// #TODO: Need to rewrite so it works with new Styles / Arrow images

type ChatBubbleProps = {
	name: string
	avatar: string
	type: string
	style: number
	message: string
}

export default class ChatBubble extends Component<ChatBubbleProps, any> {

	private type: string
	private style: string
	private avatar: string
	private name: string
	private message: string

	constructor(props: any) {

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
				<div className='bubble'>
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
				</div>
				<div className='arrow'></div>
			</div>
		)
	}
}