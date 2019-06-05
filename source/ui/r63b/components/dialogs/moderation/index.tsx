import React, { Component } from 'react'
import { dragElement } from '../../../utils/functions'

export default class Moderation extends Component {

	constructor(props: any) {
		super(props)
	}

	componentDidMount() {
		dragElement(document.getElementById('moderation'))
	}

	render() {
		return(
			<div className='illumina dialog moderation' id='moderation'>
				<div className='header' id='moderation_header'>
					<p>Mod Tools</p>

					<svg className='close'>
						<path stroke='#666666' strokeWidth='3' fill='none' d='M0.25,0.25,9.75,9.75'></path>
						<path stroke='#666666' strokeWidth='3' fill='none' d='M0.25,9.75,9.75,0.25'></path>
					</svg>
				</div>

				<div className='content'>
					<ul className='options'>
						<li>
							<img src='./moderation/room.png' />
							<span>Room tool for this Room</span>
						</li>
						<li>
							<img src='./moderation/chatlog.png' />	
							<span>Chatlog for this Room</span>
						</li>
						<li>
							<img src='./moderation/user.png' />
							<span>User info: EZ-C</span>
						</li>
						<li>
							<img src='./moderation/ticket.png' />
							<span>Ticket Browser</span>
						</li>
					</ul>	
				</div>
			</div>
		)
	}
}