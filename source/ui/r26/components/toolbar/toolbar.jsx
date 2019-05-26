import React, { Component } from 'react' 

import ChatBox from './chatbox/chatbox.jsx'

export default class Toolbar extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className='toolbar bottom'>
				<div className='container'>
					<div className='habbo'>
						<img src='https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=EZ-C&headonly=1&direction=2&head_direction=3&action=&gesture=&size=l' />
					</div>
				</div>
				{/* <ChatBox /> */}
			</div>
		)
	}
}