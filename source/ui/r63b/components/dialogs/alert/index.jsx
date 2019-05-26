import React, { Component } from 'react'

import Dialog from '../../../helpers/dialog/index.jsx';

export default class Alert extends Component {

	constructor(props) {
		super(props)

		this.state = {
			show: this.props || true
		}
	}

	render() {			
		return (
			<Dialog id='alert' className="alert" show={this.state.show} title={this.props.title} draggable={true} closeable={true}>
			
				<div className='content'>
					<img src='https://vignette.wikia.nocookie.net/habbo/images/6/62/Frank_04.gif/revision/latest?cb=20120908170058&path-prefix=en' className='image' />
					<p>{this.props.message}</p>
					<p className='author'>- {this.props.author}</p>
				</div>

				<div className='footer'>
					<button onClick={this.close} className='btn'>Close</button>
				</div>
			</Dialog>
		)
	}
}
