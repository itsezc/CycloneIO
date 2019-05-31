import React, { Component } from 'react'

export default class Wallet extends Component 
{
	constructor(props)
	{
		super(props)

		this.currencies = props.currencies
	}

	render() 
	{
		return (
			<ul className='wallet'>
				{this.currencies.map((currency, index) =>
					<li key={index}>~ {currency.amount}</li>
				)}
			</ul>
		)
	}
}