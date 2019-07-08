import React, { Component } from 'react' 

import ChatBox from './chatbox/chatbox.jsx'

export default class Toolbar extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		if(this.props.style == 'room') {
			return (
				<div className='toolbar bottom'>
					<div className='container'>
						<div className='habbo'>
							<img className='avatar' src='https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=EZ-C&headonly=1&direction=2&head_direction=3&action=&gesture=&size=l' />
							<p className='username'>EZ-C</p>
							<p className='rank'>Hotel Administrator</p> 
							<a href='#'>Update my Habbay ID</a>
						</div>
					</div>
					{/* <ChatBox /> */}
				</div>
			)
		} else {
			return (
				<div className='toolbar bottom'>
					<div className='container'>
						<div className='habbo'>
							<img className='avatar' src='https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=EZ-C&headonly=1&direction=2&head_direction=3&action=&gesture=&size=l' />
							<p className='username'>EZ-C</p>
							<p className='rank'>Hotel Administrator</p> 
							<a href='#'>Update my Habbay ID</a>
						</div>
					</div>
					{/* <ChatBox /> */}
				</div>
			)
		}
		
	}
}