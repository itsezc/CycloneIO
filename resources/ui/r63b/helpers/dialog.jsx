import React, { Component } from 'react'
import { classNames, dragElement } from '../utils/class.functions'

export default class Dialog extends Component {
	constructor(props) {
		super(props)

		this.state = {
			id: props.id,
			style: classNames(props.style),
			title: props.title,
			body: props.body,
			draggable: props.draggable
		}
	}

	componentDidMount() {
		if(this.state.draggable) {
			dragElement(document.getElementById(this.state.id))
		}
	}

	render() {
		return (
			<div className={this.state.style} id={this.state.id}>
				<div className='title' id={this.state.id.concat('_header')}>
					<span>{this.state.title}</span>
				</div>
				<div className='body'>
					{this.state.body}
				</div>
			</div>
		)
	}
}