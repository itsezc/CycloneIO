import React, { Component } from 'react'

export default class Wallet extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className='purse'>
				<ul className='currencies'>
					<li className='currency credits'>
						1000 <i className='icon credits'></i>
					</li>
					<li className='currency duckets'>
						1000 <i className='icon duckets'></i>
					</li>
					<li className='currency diamonds'>
						1000 <i className='icon diamonds'></i>
					</li>
				</ul>
				<span className='club'>
					<i className='icon hc'></i>
					<p>Join</p>
				</span>
				<ul className='buttons'>
					<li className="window-manager-button blue"><a>Help</a></li>
					<li className="window-manager-button red"><a><i className="icon-logout"></i></a></li>
					<li className="window-manager-button purple"><a><i className="icon-settings"></i></a></li>
				</ul>

			</div>
		)
	}
}