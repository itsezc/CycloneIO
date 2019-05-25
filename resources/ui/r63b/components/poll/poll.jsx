import React, { Component } from 'react'

export default class Poll extends Component {
	constructor(props) {
		super(props)

		this.question = this.props.question || 'How is your day going?'
		this.state = {
			closed: props.status,
			voted: false,
			negativeVotes: 0,
			positiveVotes: 0
		}

		this.castPositiveVote = this.castPositiveVote.bind(this)
		this.castNegativeVote = this.castNegativeVote.bind(this)
	}

	castNegativeVote() {
		this.setState({
			voted: true,
			negativeVotes: this.state.negativeVotes + 1
		})
	}

	castPositiveVote() {
		this.setState({
			voted: true,
			positiveVotes: this.state.positiveVotes + 1
		})
	}

	render() {
		if(!this.state.voted) {
			return(
				<div className='poll'>
					<h1 className='question'>{this.question}</h1>
					<div className='options'>
						<span className='option negative' onClick={this.castNegativeVote}>
							<img src='/poll/thumbs_down.png'  />
						</span>
						<span className='option positive' onClick={this.castPositiveVote}>
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
							<p>{this.state.negativeVotes || '0'}</p>
						</span>
						<h1 className='question'>{this.question}</h1>
						<span className='positive result'>
							<p>{this.state.positiveVotes || '0'}</p>
						</span>
					</div>
				</div>
			)
		}
		
	}
}