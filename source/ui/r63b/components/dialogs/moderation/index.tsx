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
				<div className='header'>
					<p>Mod Tools</p>

					<svg className='close'>
						<path stroke='#666666' strokeWidth="3" fill="none" d="M0.25,0.25,9.75,9.75"></path>
						<path stroke='#666666' strokeWidth="3" fill="none" d="M0.25,9.75,9.75,0.25"></path>
					</svg>
				</div>
				<div className='content'>
					<ul className='options'>
						<li>
							<img src='http://habboemotion.com/resources/images/icons/room_3.gif' />
							<span>Room tool for this Room</span>
						</li>
						<li>
							<img src='https://www.habborator.org/archive/icons/mini/tab_icon_03_community.gif' />	
							<span>Chatlog for this Room</span>
						</li>
						<li>
							<img src='http://habboemotion.com/resources/images/icons/welcome.gif' />
							<span>User info: EZ-C</span>
						</li>
						<li>
							<img src='http://habboemotion.com/resources/images/icons/tab_icon_08_hep.gif' />
							<span>Ticket Browser</span>
						</li>
					</ul>	
				</div>
			</div>
		)
	}
}