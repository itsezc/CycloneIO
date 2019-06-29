import React, { Component } from 'react'

import Dialog from '../../../helpers/dialog'

type AlertProps =  {
	show?: boolean
	message?: string
	author?: string
	title: string
}

type AlertState = {
	show: boolean
}

export default class Alert extends Component<AlertProps, AlertState> {

	constructor(props: AlertProps) {
		super(props)

		this.state = {
			show: this.props.show || true
		}

		this.close.bind(this)
	}

	close = () => {
		this.setState({
			show: false
		})
	}

	render() {
		if(this.state.show) {
			return (
				<Dialog
					id='alert'
					show={this.state.show}
					title={this.props.title}
					closeable={false}
					width={350}
					height={180}
					className='alert'
				>
						<div className='content'>
							<img src='https://vignette.wikia.nocookie.net/habbo/images/6/62/Frank_04.gif/revision/latest?cb=20120908170058&path-prefix=en' className='image' />
							<p>{this.props.message}</p>
							<p className='author'>- {this.props.author}</p>
						</div>

						<div className='footer'>
							<button onClick={this.close} className='button'>Close</button>
						</div>
				</Dialog>
			)
		} else {
			return null
		}
	}
}
