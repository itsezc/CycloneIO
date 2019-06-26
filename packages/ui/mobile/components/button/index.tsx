import React, { Component } from 'react'

type ButtonState = {
	text: string
	style: string
}

export default class Button extends Component<any, ButtonState> {

	constructor(props: any){
		super(props)

		const text: string = (props.text) ? props.text : 'Button'
		const style: string = (props.style) ? 'button'.concat(props.style) : 'button'

		this.state = {
			text,
			style
		}
	}

	render(){
		return (
			<button className={this.state.style}>
				{this.state.text}
			</button>
		)
	}
}