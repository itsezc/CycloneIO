import React, { Component } from 'react'

import { Tab, Tabs, TabList } from 'react-tabs'

import Dialog from '../../../helpers/dialog'

type InventoryProps =  {
	show?: boolean
}

type InventoryState = {
	show: boolean
}

export default class Inventory extends Component<InventoryProps, InventoryState> {

	constructor(props: InventoryProps) {
		super(props)

		this.state = {
			show: this.props.show || true
		}

		this.close.bind(this)
	}

	close = () => {
		this.setState({
			show: false
		})
	}

	render() {
		if(this.state.show) {
			return (
				<Dialog
					id='alert'
					show={this.state.show}
					title='Inventory'
					closeable={false}
					// draggable={false}
					width={490}
					height={342}
					centered={true}
					className='alert'
				>
						<div className='content'>
							<Tabs>
								<TabList className='tabs'>
									<Tab className='tab'>Test</Tab>
								</TabList>
							</Tabs>
						</div>
				</Dialog>
			)
		} else {
			return null
		}
	}
}
