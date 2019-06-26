import React, { Component } from 'react'
import { classNames } from '../../utils/functions'

export default class Wallet extends Component {
	constructor(props) {
		super(props)

		//@@ MOCK
		this.data = [
			{ name: 'credits', value: 5000, style: { color: '' } },
			{ name: 'duckets', value: 5000, style: { color: '' } },
			{ name: 'diamonds', value: 50, style: { color: '' } }
		]

		this.state = {
			currencies: props.currencies || this.data
		}

		this.currencies = this.state.currencies.map((data, index) => {
			let liClass = 'currency'
			liClass = liClass.concat(' ', data.name)

			let iconClass = 'icon'
			iconClass = iconClass.concat(' ', data.name)

			return (
				<li className={liClass} key={index}>
					{data.value}
					<i className={iconClass}></i>
				</li>
			)
		})


	}

	render() {
		return (
			<div className='purse'>
				<ul className='currencies'>
					{this.currencies}
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