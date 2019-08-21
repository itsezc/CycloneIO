import React, { Component } from 'react'

import './Camera.styl'

export default class Camera extends Component {
	
	public render() {

		return(
			<div className='camera'>
				<h1 className='title'>Habbo Camera</h1>
				<span className='hud'></span>
				<span className='snap'></span>
			</div>
		)

	}

}