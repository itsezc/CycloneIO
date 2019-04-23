import React, { Component } from 'react'

export default class CatalogFrontPage extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<div className='page'>
				<div className='sidebar'>
					<a href='#'><img src='https://habboo-a.akamaihd.net/c_images/catalogue/feature_cata_vert_habbergersbundle.png' /></a>
				</div>
				<div className='content'>
					<a href='#'><img src='https://habboo-a.akamaihd.net/c_images/catalogue/feature_cata_hort_olympic16.png' /></a>
					<a href='#'><img src='https://habboo-a.akamaihd.net/c_images/catalogue/feature_cata_hort_puraiced16_b.png' /></a>
					<a href='#'><img src='https://habboo-a.akamaihd.net/c_images/catalogue/feature_cata_hort_HC_b.png' /></a>

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