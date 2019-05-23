import React, { Component } from 'react'

type Props = {
	value: float,
	max: float
}

export default class ProgressBar extends Component<Props> {
	constructor(props) {
		super(props)

		this.state = {
			value: props.value,
			max: props.max
		}
	}

	render() {
		return(
			<div className='progress' data-label='Only 120/120 credits to go!'>
				<progress value={this.state.value} max={this.state.max}></progress>
			</div>
		)
	}
}