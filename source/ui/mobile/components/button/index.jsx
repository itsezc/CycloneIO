import React, { Component } from 'react'

export default class Button extends Component 
{
	constructor(props) {
		super(props)

		this.text = (this.props.text) ? this.props.text : 'Button'
		this.style = (this.props.style) ? 'button'.concat(this.props.style) : 'button'

		this.state = {
			text: this.text,
			style: this.style
		}
	}

	render()
	{
		return (
			<button className={this.style}>
				{this.state.text}
			</button>
		)
	}
}