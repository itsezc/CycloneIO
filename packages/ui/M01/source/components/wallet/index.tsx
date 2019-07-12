import React, { Component } from 'react'

type WalletProps = {
	currencies: Currency[]
}

type Currency = {
	amount: number
}

export default class Wallet extends Component<any, WalletProps> {

	private currencies: Currency[]

	constructor(props: any) {
		super(props)

		this.currencies = props.currencies
	}

	render() {
		return (
			<ul className='wallet'>
				{this.currencies.map((currency, index) =>
					<li key={index}>~ {currency.amount}</li>
				)}
			</ul>
		)
	}
}