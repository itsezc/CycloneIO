import React, { Component } from 'react'

import '../../styles/illumina.styl'

export default class Moderation extends Component {
	constructor(props) {
		super(props)
	}

	componentDidMount() {
		dragElement(document.getElementById('moderation'))

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
		return(
			<div className='illumina dialog moderation' id='moderation'>
				<div className='header'>
					<p>Mod Tools</p>
				</div>
				<div className='content'>
					<ul className='options'>
						<li>
							<img src='http://habboemotion.com/resources/images/icons/room_3.gif' />
							<span>Room tool for this Room</span>
						</li>
						<li>
							<img src='https://www.habborator.org/archive/icons/mini/tab_icon_03_community.gif' />	
							<span>Chatlog for this Room</span>
						</li>
						<li>
							<img src='http://habboemotion.com/resources/images/icons/welcome.gif' />
							<span>User info: EZ-C</span>
						</li>
						<li>
							<img src='http://habboemotion.com/resources/images/icons/tab_icon_08_hep.gif' />
							<span>Ticket Browser</span>
						</li>
					</ul>	
				</div>
			</div>
		)
	}
}