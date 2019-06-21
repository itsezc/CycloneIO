import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import Dialog from '../../../helpers/dialog'
import { dragElement } from '../../../utils/functions'

import { Query } from 'react-apollo'
import { GetActiveRooms, GetActiveRooms_rooms, GetNavigatorTabs_navigatorTabs, GetNavigatorTabs } from '../../../../../storage/__generated__/types'
import { GetActiveRooms as RoomsQUERY, GetNavigatorTabs as TabsQUERY} from '../../../../../storage/queries'


type NavigatorState = {
	defaultCategory: number
}

export default class Navigator extends Component <any, NavigatorState>
{

	private query: Query 

	constructor(props: any)
	{
		super(props)

		this.state = {
			defaultCategory: 1
		}
	}

	componentDidMount()
	{
		dragElement(document.getElementById('navigator'))
	}

	render()
	{
		return(
			<div>
				{/* variables={{ limit: 2 }} */}
				<Query<GetActiveRooms, GetActiveRooms_rooms> query={RoomsQUERY} notifyOnNetworkStatusChange>
					{({ loading, error, data }) => {
						if (loading) return 'Loading..'
						if (error) return 'Error..'

						return (
							<Dialog 
								id='navigator'
								title='Navigator'
								resize={true}
								axis='y'
								width={450}
								height={630}
							>
								<Tabs
									selectedTabClassName='active'
								></Tabs>
								<Query<GetNavigatorTabs, GetNavigatorTabs_navigatorTabs> query={TabsQUERY} notifyOnNetworkStatusChange>
									{({ loading, error, data }) => {
											if (loading) return 'Loading..'
											if (error) return 'Error..'

											console.log(data)

											return (
												<div>
												{
													data.navigatorTabs.map(instance => (
														<p key={instance.order}>{instance.name}</p>
													))
												}
												</div>
											)	
										}
									}
								</Query>
								{
									data.rooms.map(room => (
										<p key={room.id}>{room.id} : {room.name} : Current({room.currentUsers})</p>
									))
								}
							</Dialog>
						)
					}}
				</Query>
			</div>
		)	
	}
}