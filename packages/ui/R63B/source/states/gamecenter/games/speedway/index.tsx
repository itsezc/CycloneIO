import React, { Component } from 'react'

export default class Speedway extends Component {
	render() {
		return(
			<div className='gamecontainer'>

				<div className='game__container__content'>
					<p>Ready, Set... GO!</p>
					<img src='/games/speedway/logo.png' className='logo' />
					<div className='description'>
						Strap yourself in for some slotcar carnage, Race the track against friends, <br /> use a variety of power-ups to reach pole position and take some gold.
					</div>

					<button className='illumina-button'>
						Play Now
					</button>
				</div>

				<div className='banner'>
					<img src='/games/speedway/banner.png'/>
				</div>
			</div>
		)
	}
}