import React, { Component } from 'react'

export default class Alert extends Component {
	constructor(props) {
		super(props)
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
				<ul className='tabs'>
					<li className='tab active'><a>Front Page</a></li>
					<li className='tab'><a>Furni</a></li>
					<li className='tab'><a>Clothing</a></li>
					<li className='tab'><a>Pets</a></li>
					<li className='tab'><a>Memberships</a></li>
				</ul>
				<div className='banner'>
					<h1 className='name'>Front Page</h1>
					<div className='image'>
						<img src='https://imgur.com/O1EqujY.gif' width='200%' height='200%' />
					</div>
				</div>
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
			</div>
		)
	}
}
