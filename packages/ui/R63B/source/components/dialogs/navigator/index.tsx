import React, { Component } from 'react'

import { Tab, Tabs, TabList } from 'react-tabs'
import { Accordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion'
import Select from 'react-select'

import Dialog from '../../../helpers/dialog'
import { dragElement } from '../../../utils/functions'

import { Query } from 'react-apollo'
import { 
	GetActiveRooms as RoomsQUERY, 
	GetNavigatorTabs as TabsQUERY,
	GetNavigatorCategories as CategoriesQUERY
} from '../../../../../../storage/queries'

import { 
	GetActiveRooms, 
	GetActiveRooms_rooms, 
	GetNavigatorTabs_navigatorTabs, 
	GetNavigatorTabs,
	GetNavigatorCategories,
	GetNavigatorCategories_navigatorCategories 
} from '../../../../../../storage/__generated__/types'

type NavigatorState = {
	category: number
	rooms: any,
	currentFilter: any,
	filter: {label: string, value: string}[]
}

export default class Navigator extends Component <any, NavigatorState>
{

	private query: Query
	
	constructor(props: any)
	{
		super(props)

		this.state = {
			category: 1,
			rooms: [],
			currentFilter: null,
			filter: [
				{ label: 'Anything', value: 'anything' },
				{ label: 'Room Name', value: 'room' },
				{ label: 'Owner', value: 'owner' },
				{ label: 'Tag', value: 'tag' } ,
				{ label: 'Group', value: 'group' }
			]
		}

		this.filter = this.filter.bind(this)
	}

	getTabs()
	{
		return(
			<div>
				<Tabs
					selectedTabClassName='active'
					selectedIndex={this.state.category}
					onSelect={(category: number) => this.setState({ category })}
				></Tabs>
				<Query<GetNavigatorTabs, GetNavigatorTabs_navigatorTabs> query={TabsQUERY} notifyOnNetworkStatusChange>
					{({ loading, error, data }) => {
							if (loading) return 'Loading..'
							if (error) return 'Error..'

							return (
								<TabList className='tabs'>
								{
									data.navigatorTabs.map(instance => (
										<Tab className='tab' key={instance.id}>{instance.name}</Tab>
									))
								}
								</TabList>
							)	
						}
					}
				</Query>
			</div>
		)
	}

	getCategories()
	{
		return(
			<Query<GetNavigatorCategories, GetNavigatorCategories_navigatorCategories> query={CategoriesQUERY}>
				{({ loading, error, data }) => {
					if (loading) return 'Loading..'
					if (error) return 'Error..'
				
					// console.log(data)

					return(
						<Accordion
							allowMultipleExpanded={true}
							allowZeroExpanded={true}
						>
							{
								data.navigatorCategories.map(category => (
									<AccordionItem key={category.id}>
										<AccordionItemHeading>
											<AccordionItemButton>
												{category.name}
											</AccordionItemButton>
									</AccordionItemHeading>
										<AccordionItemPanel>
											{
												this.getRooms(category.id)
											}
										</AccordionItemPanel>
									</AccordionItem>		
								))
							}
						</Accordion>	
					)
				}}
			</Query>
		)
	}

	getRooms(category: string)
	{
		return(
			<Query<GetActiveRooms, GetActiveRooms_rooms> query={RoomsQUERY} notifyOnNetworkStatusChange>
				{({ loading, error, data }) => {
					if (loading) return 'Loading..'
					if (error) return 'Error..'

					return(
						data.rooms.map((room: any) => (
							<p key={room.id}>{room.id} : {room.name} : Current({room.currentUsers})</p>
						))
					)
				}}
			</Query>
		)
	}

	filter(currentFilter: any) {
		this.setState({ currentFilter })
	}

	render()
	{
		return(
			<Dialog 
				id='navigator'
				title='Navigator'
				resize={true}
				axis='y'
				width={425}
				height={530}
				background='#FFFFFF'
			>
				{/* variables={{ limit: 2 }} */}
				<div className='navigator'>
					{ 
						this.getTabs() 
					}
					<Select
						// className='dropdown'
						// controlClassName='dropdown-control'
						options={this.state.filter}
						value={this.state.currentFilter || this.state.filter[0]}
						onChange={this.filter}
						isMulti={false}
						isSearchable={false}
					/>
					<div className='page'>
						{ this.getCategories() }
					</div>
				</div>
			</Dialog>
		)	
	}
}