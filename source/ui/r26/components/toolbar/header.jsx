import React, { Component } from 'react'
import OnlineCount from './online/online.jsx'

export default class Header extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className='toolbar top'>
				<div className='logo'>
					<img src='http://habbox.com/text/Big/habbo' />
				</div>
				
				<OnlineCount />
				
				<span className='close'>CLOSE HOTEL</span>
			</div>
		)
	}
}