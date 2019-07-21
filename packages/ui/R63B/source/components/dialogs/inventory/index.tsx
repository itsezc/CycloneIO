import React, { Component } from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

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
					id='inventory'
					show={this.state.show}
					title='Inventory'
					closeable={false}
					// draggable={false}
					width={490}
					height={342}
					centered={true}
					className='inventory'
				>
						<div className='content'>
							<Tabs>
								<TabList className='tabs'>
									<Tab className='tab active'>Furniture</Tab>
									<Tab className='tab'>Rentables</Tab>
									<Tab className='tab'>Pets</Tab>
									<Tab className='tab'>Achieved badges</Tab>
									<Tab className='tab'>Bots</Tab>
								</TabList>
								<TabPanel className='inner'>
									Test
								</TabPanel>
								<TabPanel>
									Test
								</TabPanel>
								<TabPanel>
									Test
								</TabPanel>
								<TabPanel>
									Test
								</TabPanel>
								<TabPanel>
									Test
								</TabPanel>
							</Tabs>
						</div>
				</Dialog>
			)
		} else {
			return null
		}
	}
}
