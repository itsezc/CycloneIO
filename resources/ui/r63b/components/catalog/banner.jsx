import React, { Component } from 'react'

export default class CatalogBanner extends Component {
	render() {
		return (
			<div className='banner'>
				<h1 className='name'>Front Page</h1>
				<div className='image'>
					<img src='https://imgur.com/O1EqujY.gif' width='200%' height='200%' />
				</div>
			</div>
		)
	}
}