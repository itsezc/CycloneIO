import React, { Component } from 'react'

export default class Wallet extends Component {

	private data: any[]

	constructor(props: any) {
		super(props)

		//@@ MOCK
		this.data = [
			{name: 'diamonds', icon: 'diamond', value: 50},
			{name: 'credits', icon: 'credit', value: 5000},
			{name: 'duckets', icon: 'ducket', value: 5000}
		]
	}

	render() {
		return (
			<div className='wallet'>

				<div className="currencies">
					{this.data.map((data, index) => 
						<div key={index} className={"currency-item currency-" + data.name}>
							{data.value}<i className={"icon icon-" + data.icon}></i>
						</div>
					)}
				</div>

				<span className="club">
					<i className="icon icon-hc"></i>
					<p>Join</p>
				</span>

				<div className="buttons">
					<a className="btn-blue">Help</a>
					<a className="btn-red icon icon-logout"></a>
					<a className="btn-gray icon icon-settings"></a>
				</div>
			</div>
		)
	}
}