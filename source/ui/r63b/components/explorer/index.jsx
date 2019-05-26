import React, { Component } from 'react'

export default class explorer extends Component {
	constructor(props) {
		super(props)

		this.name = props.name
		this.type = props.type
		
	}

	render() {

		switch (this.type) {
			case 'user':
				return(
					<div className='explorer'>
						This is the User {this.name}
					</div>
				)
				break

			case 'furniture':
			default:
				return(
					<div className='explorer'>
						This is the Furniture {this.name}
					</div>
				)
				break
		}
		
	}
}