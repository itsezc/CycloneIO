import React, { Component } from 'react'

import ScrollBar from '../../../../helpers/scrollbar'
import Navgiation from '../components/navigation'

import { Query } from 'react-apollo'
import { 
	GetCatalogPages as CatalogPagesQUERY
} from '../../../../../../../storage/queries'

import {
	GetCatalogPages,
	GetCatalogPages_catalogPages,
	GetCatalogPages_catalogPages_language,
	GetCatalogPages_catalogPages_parent
} from '../../../../../../../storage/__generated__/types'

export default class CatalogFurniPage extends Component <any, any> {

	constructor(props: any) {
		super(props)
	}

	render() {
		return(
			<Query<GetCatalogPages, GetCatalogPages_catalogPages> query={CatalogPagesQUERY} notifyOnNetworkStatusChange>
				{({ loading, error, data }) => {
						if (loading) return 'Loading..'
						if (error) return 'Error..'

					const { catalogPages } = data
					
					return (
						<div className='page'>
							<div className='sidebar'>
								<div className='search'>
									<input type='text' placeholder='Search here' />
								</div>
								<Navgiation 
									pages={catalogPages}
								/>
							</div>
							<div className='content'>
									Test
							</div>
						</div>
					)
				}}
			</Query>
		)
	}
}