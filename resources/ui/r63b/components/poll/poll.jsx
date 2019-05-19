import React, { Component } from 'react'

export default class Poll extends Component {
	constructor(props) {
		super(props)

		this.question = this.props.question || 'How is your day going?'
		this.state = {
			ended: true,
			votes: {
				negative: 0,
				positive: 0
			}
		}
	}

	render() {
		if(!this.state.ended) {
			return(
				<div className='poll'>
					<h1 className='question'>{this.question}</h1>
					<div className='options'>
						<span className='option negative'>
							<img src='/poll/thumbs_down.png' />
						</span>
						<span className='option positive'>
							<img src='/poll/thumbs_up.png' />
						</span>
					</div>
				</div>
			)
		} else {
			return(
				<div className='poll'>
					<div className='results'>
						<span className='negative result'>
							<p>5</p>
						</span>
						<h1 className='question'>{this.question}</h1>
						<span className='positive result'>
							<p>10</p>
						</span>
					</div>
				</div>
			)
		}
		
	}
}