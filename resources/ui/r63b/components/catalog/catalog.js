import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import CatalogBanner from './banner.jsx'

import 'react-tabs/style/react-tabs.css';

export default class Alert extends Component {
	constructor(props) {
		super(props)

		this.state = {
			category: 0
		}
	}

	componentDidMount() {
		dragElement(document.getElementById('catalog'))

		function dragElement(elmnt) {
		  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
		  if (document.getElementById(elmnt.id + "_header")) {
		    // if present, the header is where you move the DIV from:
		    document.getElementById(elmnt.id + "_header").onmousedown = dragMouseDown;
		  } else {
		    // otherwise, move the DIV from anywhere inside the DIV:
		    elmnt.onmousedown = dragMouseDown;
		  }

		  function dragMouseDown(e) {
		    e = e || window.event;
		    e.preventDefault();
		    // get the mouse cursor position at startup:
		    pos3 = e.clientX;
		    pos4 = e.clientY;
		    document.onmouseup = closeDragElement;
		    // call a function whenever the cursor moves:
		    document.onmousemove = elementDrag;
		  }

		  function elementDrag(e) {
		    e = e || window.event;
		    e.preventDefault();
		    // calculate the new cursor position:
		    pos1 = pos3 - e.clientX;
		    pos2 = pos4 - e.clientY;
		    pos3 = e.clientX;
		    pos4 = e.clientY;
		    // set the element's new position:
		    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
		    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
		  }

		  function closeDragElement() {
		    // stop moving when mouse button is released:
		    document.onmouseup = null;
		    document.onmousemove = null;
		  }
		}
	}

	render() {
		return (
			<div className='catalogue' id='catalog'>
				<div className='title' id='catalog_header'>
					Shop
				</div>

				<Tabs selectedIndex={this.state.category} onSelect={category => this.setState({ category })}>
					<TabList className='tabs'>
						<Tab className='tab active'>Front Page</Tab>
						<Tab className='tab'>Furni</Tab>
						<Tab className='tab'>Clothing</Tab>
						<Tab className='tab'>Pets</Tab>
						<Tab className='tab'>Memberships</Tab>
					</TabList>

					<TabPanel>
						<CatalogBanner />
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
					</TabPanel>
					
					<TabPanel>
						Test 2
					</TabPanel>
					<TabPanel>
						Test 3 
					</TabPanel>
					<TabPanel>
						Test 4
					</TabPanel>
					<TabPanel>
						Test 5
					</TabPanel>
				</Tabs>				
			</div>
		)
	}
}
