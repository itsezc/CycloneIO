import React, { Component } from 'react'

import { Query } from 'react-apollo'

import { 
	GetCatalogFeatureds as CatalogFeaturedsQUERY
} from '../../../../../../../storage/queries'

import {
	GetCatalogFeatured,
	GetCatalogFeatured_catalogFeatureds,
	GetCatalogFeatured_catalogFeatureds_link
} from '../../../../../../../storage/__generated__/types'

export default class CatalogFrontPage extends Component<any, any> {

	constructor(props: any) {
		super(props)
	}

	render() {
		return(
			<Query<GetCatalogFeatured, GetCatalogFeatured_catalogFeatureds> query={CatalogFeaturedsQUERY} notifyOnNetworkStatusChange>
				{({ loading, error, data }) => {
						if (loading) return 'Loading..'
						if (error) return 'Error..'

						const { catalogFeatureds } = data
						
						return (
							<div className='frontpage'>
								<div className='sidebar'>

								{
									catalogFeatureds.map(({ link, image, caption }, index) => (
										(index == 0) ?
											<a href='#' key={index}>
												<img src={image} />
												<div className='caption'>
													<h2>{caption}</h2>
												</div>
											</a>
										
											:

										null
									))
								}
								
								</div>
								<div className='content'>

									{
										catalogFeatureds.map(({ link, image, caption }, index) => (
											(index !== 0) ?
												<a key={index}>
													<img src={image} />
													<div className='caption'>
														<h2>{caption}</h2>
													</div>
												</a>
											
												:
											
											null
										))
									}

									<div className='voucher'>
										<div className='container'>

											<p>Redeem a voucher code here:</p>
											<input type='text' />
											<button className='redeem'>Redeem</button>
										</div>
									</div>
								</div>
							</div>
						)
					}
				}
			</Query>			
		)
	}
}