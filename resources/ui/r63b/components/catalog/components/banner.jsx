import React, { Component } from 'react'

export default class CatalogBanner extends Component {
	constructor(props) {
		super(props)
		
		this.state = {}
		
		this.imageStyle = {
			background: 'linear-gradient(rgba(14, 63, 82, 0.9), rgba(14, 63, 82, 0.9)), url(https://imgur.com/O1EqujY.gif)',
			backgroundSize: '115%',
			backgroundRepeat: 'no-repeat',
			backgroundPosition: 'center'
		}
	}

	render() {
		return (
			<div className='banner' style={this.imageStyle}>
				<h1 className='name'>{this.props.title}</h1>
				<div className='image'>
					<span className='overlay'></span>
				</div>
			</div>
		)
	}
}