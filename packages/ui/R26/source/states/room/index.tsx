import React, { Component } from 'react'

import './index.styl'
import '../../components/index.styl'

import Header from '../../components/toolbar/header.jsx'
import Toolbar from '../../components/toolbar/toolbar.jsx'

export default class Client extends Component {

	// componentWillMount()
	// {
	// 	const script = document.createElement('script')
	// 	script.src = 'http://localhost:8082/client.js'
	// 	document.body.appendChild(script)
	// }

	render() {
		return(
			<div className='client'>
				<Header />

				{/* <div className='hotel'>
				
					<div className='drape'>`
						<div className='border'>
							<div className='inner'>
								<img src='https://t6.rbxcdn.com/6435cc11a0a3ce1764c8e825a0bbc539' />
							</div>
						</div>
					</div>
				</div> */}
				
				<Toolbar style='room' />
			</div>
		)
	}
}