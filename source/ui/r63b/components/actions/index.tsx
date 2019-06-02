import React, { Component } from 'react'
import { fullScreen } from '../../utils/functions'

type ActionsState = {
	fullScreen: boolean
}

export default class Actions extends Component<any, ActionsState> {

	constructor(props: any) {
		super(props)

		this.state = {
			fullScreen: false
		}
	}

	toggleFullscreen = (event: React.MouseEvent) => {
		
		this.setState({
			fullScreen: !this.state.fullScreen
		}, () => {

			/*
			if(this.state.fullScreen){
				document.requestFullscreen();
			}*/

			//fullScreen(this.state.fullScreen)
		})
	}
 
	render() {
		return (
			<div className='actions'>

				<button className='action-item action-item-arrow'>
					<i className="main-icon icon-habbo"></i>
					<span className="action-item-expand">WEB</span>
				</button>

				<button className='action-item' onClick={this.toggleFullscreen}>
					<i className={"main-icon " + (this.state.fullScreen ? "icon-disable-fs" : "icon-fs")}></i>
				</button>
			</div>
		)
	}
}