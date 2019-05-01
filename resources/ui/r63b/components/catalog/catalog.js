import React, { Component } from 'react'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'

import CatalogBanner from './components/banner.jsx'

import CatalogFrontPage from './pages/frontpage.jsx'
import CatalogFurniPage from './pages/furni.jsx'

export default class Alert extends Component {
	constructor(props) {
		super(props)

		this.icons = {
			url: 'http://localhost:8081/web-gallery/catalogue/icons/icon_',
			ext: 'png'
		} 

		this.state = {
			category: 0,

			// @@MOCK
			catalogue: [
				{ id: 0, parent: -1, name: 'Front Page', icon: '1', layout: 'frontpage' },
				{ id: 1, parent: -1, name: 'Furni', description: 'This is an example description for furni', 'icon': '2', },
				{ id: 2, parent: -1, name: 'Clothing', description: 'This is an example description for clothing', icon: '3', },
				{ id: 3, parent: -1, name: 'Pets', description: 'This is an example description for pets', icon: '4', },
				{ id: 4, parent: -1, name: 'Memberships', description: 'This is an example description for memberships', icon: '5' },
				{ id: 5, parent: 1, name: 'Spaces', description: 'This is an example description for spaces', icon: '6' },
				{ id: 6, parent: 1, name: 'Backgrounds', description: 'This is an example description for backgrounds', icon: '7' }
			]
		}

		this.categories = this.state.catalogue.map((page) => {
			if(page.parent == -1) {
				return (
					<Tab className='tab' key={page.id}>
						{page.name}
					</Tab>
				)
			}
		})
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

				<Tabs selectedTabClassName='active' selectedIndex={this.state.category} onSelect={category => this.setState({ category })}>
					<TabList className='tabs'>
						{this.categories}
					</TabList>

					
				</Tabs>				
			</div>
		)
	}
}
