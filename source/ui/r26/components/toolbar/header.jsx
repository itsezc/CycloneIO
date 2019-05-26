import React, { Component } from 'react'

export default class Header extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className='toolbar top'>
				<div class='logo'>
					<img src='http://habbox.com/text/Big/habbo' />
				</div>
				
				<span class='close'>CLOSE HOTEL</span>
			</div>
		)
	}
}