import React, { Component } from 'react'
import { classNames, dragElement } from '../../../utils/functions'
import '../../../styles/illumina.styl'

export default class Moderation extends Component {
	constructor(props) {
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
							<img src='https://media.discordapp.net/attachments/571637525295398913/579665088965771300/modtool_test.png' />
							<span>Room tool for this Room</span>
						</li>
						<li>
							<img src='https://media.discordapp.net/attachments/571637525295398913/579664994380021780/modtool_test.png' />	
							<span>Chatlog for this Room</span>
						</li>
						<li>
							<img src='https://media.discordapp.net/attachments/571637525295398913/579665181488054302/modtool_test.png' />
							<span>User info: EZ-C</span>
						</li>
						<li>
							<img src='https://media.discordapp.net/attachments/571637525295398913/579665505388855309/modtool_test.png' />
							<span>Ticket Browser</span>
						</li>
					</ul>	
				</div>
			</div>
		)
	}
}