import React, { Component } from 'react'
import Dialog from '../../helpers/dialog.jsx'

export default class Alert extends Component {

	constructor(props) {
		super(props)

		this.state = {
			show: true
		}
	}

	close() {
		this.setState({ show: false })
	}

	componentDidMount() {
		dragElement(document.getElementById('alert'))

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
			<div className='alert' id='alert'>
				<div className='title' id='alert_header'>
					<span>{this.props.title}</span>
				</div>
				<div className='content'>
					<img src='https://vignette.wikia.nocookie.net/habbo/images/6/62/Frank_04.gif/revision/latest?cb=20120908170058&path-prefix=en' className='image' />
					<p>{this.props.message}</p>
					<p className='author'>- {this.props.author}</p>
				</div>
				<div className='footer'>
					<button onClick={this.close} className='button'>Close</button>
				</div>
			</div>
		)
	}
}
