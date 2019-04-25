import React, { Component } from 'react'

export default class CatalogFrontPage extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return(
			<div className='page'>
				<div className='sidebar'>
					<a href='#'><img src='https://habboo-a.akamaihd.net/c_images/catalogue/feature_cata_vert_easter19_swingtree.png' /></a>
				</div>
				<div className='content'>
					<a href='#'><img src='https://habboo-a.akamaihd.net/c_images/catalogue/feature_cata_hort_easter19_bun2.png' /></a>
					<a href='#'><img src='https://habboo-a.akamaihd.net/c_images/catalogue/feature_cata_hort_easter19_bun3.png' /></a>
					<a href='#'><img src='https://habboo-a.akamaihd.net/c_images/catalogue/feature_cata_hort_easter19_bun4.png' /></a>

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