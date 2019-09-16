import * as React from 'react'

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import Dialog from '../../../helpers/dialog'

const Inventory = () => {

	return(
		<Dialog
			id='inventory'
			title='Inventory'
			closeable={false}
			width={490}
			height={342}
			centered={true}
			className='inventory'
			top={200}
			left={400}
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
}

export default Inventory