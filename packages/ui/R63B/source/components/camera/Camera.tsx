import React, { Component } from 'react'
import { dragElement } from '../../utils/functions'

import './Camera.styl'

export default class Camera extends Component<any, any> {

	public constructor(props: any) {
		super(props)
	
		this.state = {
			isOpen: true,
			maxPhotos: 5,
			currentPhotos: 0,
			isPreview: false
		}		
	}

	public componentDidMount() {
		dragElement(document.getElementById('cameraContainer'))
	}

	public close() {
		this.setState({ isOpen: false })
	}
	
	public render() {

		if (this.state.isOpen) {
			return(
				<div className='cameraContainer' id='cameraContainer'>
					<div className='camera' id='camera'>
						<h1 className='title'>Habbo Camera</h1>
	
						<div className='cameraActions'>
							<button className='btn btn-r63b btn-action btn-red' onClick={this.close.bind(this)}>
								<i className='icon icon-close'></i>
							</button>
						</div>
						
						{ this.state.isPreview ? null : <span className='hud'></span> }

						<span className='snap'></span>
					</div>
					<div className='gallery'>
						<div className='imageContainer active'>
							<img />
						</div>
						<div className='imageContainer'>
							<img />
						</div>
						<div className='imageContainer'>
							<img />
						</div>
						<div className='imageContainer'>
							<img />
						</div>
						<div className='imageContainer'>
							<img />
						</div>
					</div>
				</div>
			)
		} else {
			return null
		}
		

	}

}