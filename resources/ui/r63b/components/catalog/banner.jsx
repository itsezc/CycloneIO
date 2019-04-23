import React, { Component } from 'react'

export default class CatalogBanner extends Component {
	constructor(props) {
		super(props)
		
		this.state = {}
	}

	render() {
		return (
			<div className='banner'>
				<h1 className='name'>{this.props.title}</h1>
				<div className='image'>
					<img src={this.props.image} width='200%' height='200%' />
				</div>
			</div>
		)
	}
}