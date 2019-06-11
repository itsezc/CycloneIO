import React, { Component } from 'react'

import './index.styl'

export default class Client extends Component {
	render() {
		return(
			<div className='client'>
				<div className='room' id='game'>
					<img className='icon' src='https://upload.wikimedia.org/wikipedia/commons/8/80/SemihReiz.png' />

					<div className='navigation'>
						<img className='avatar' src='https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=EZ-C&headonly=1&direction=2&head_direction=3&action=&gesture=&size=l' />
					
						<div className='news'></div>
						<div className='navigator'></div>

						<div className='center'>
							<input type='text' placeholder='Say hi!' className='chatbar' />
						</div>

						<div className='store'></div>
						<div className='inventory'></div>
						<div className='friends'></div>
					</div>
				</div>
			</div>
		)
	}
}