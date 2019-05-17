import React, { Component } from 'react'

import Navgiation from '../components/navigation.jsx'

export default class CatalogFurniPage extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<div className='page'>
				<div className='sidebar'>
					<div className='search'>
						<input type='text' placeholder='Search here' />					
					</div>
					<Navgiation />
				</div>
				<div className='content'>
					
				</div>
			</div>
		)
	}
}