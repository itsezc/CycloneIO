import React, { Component } from 'react'

import './hotel.styl'

export default class Hotel extends Component 
{
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className='client'>
				<div className='hotel'>
					This is the hotel
				</div>
			</div>
		)
	}
}