import React, { Component } from 'react'
import Drag from 'react-drag-element'

import './Camera.styl'

export default class Camera extends Component<any, any> {

	public constructor(props: any) {
		super(props)
	
		this.state = {
			isOpen: true
		}		
	}

	public close() {
		this.setState({ isOpen: false })
	}

	public getFloatingComponentPosition = (positions: any) => {
		console.log("FLOATING COMPONENT POSITIONS....", positions);
	}
	
	public render() {

		if (this.state.isOpen) {
			return(
				<Drag
					dragItemId={'cameraContainer'}
					dragId={'camera'}
				>
					<div className='cameraContainer' id='cameraContainer'>
						<div className='camera' id='camera'>
							<h1 className='title'>Habbo Camera</h1>
		
							<div className='cameraActions'>
								<button className='btn btn-r63b btn-action btn-red' onClick={this.close.bind(this)}>
									<i className='icon icon-close'></i>
								</button>
							</div>
							
		
							<span className='hud'></span>
							<span className='snap'></span>
						</div>
					</div>
				</Drag>
			)
		} else {
			return null
		}
		

	}

}