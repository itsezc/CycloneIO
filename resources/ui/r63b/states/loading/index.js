import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import './loading.styl'

export default class Loading extends Component {
	
	constructor(props) {
		super(props)

		this.state = {
			percent: 0
		}
	}

	componentDidMount() {
		this.interval = setInterval(() => {

			if(this.state.percent > 99) {
				this.props.onFinishLoading();
			}

			this.setState({
				percent: this.state.percent + 10
			})
		}, 500)
	 }

	componentWillUnmount() {
		clearInterval(this.interval)
	}

	render() {
		return(
			<div className='loading'>

				<div className='splash'>
					<div className='photo'></div>
					<div className='frame'></div>
				</div>

				<div className='text'>Please wait while {this.props.hotelName} is loading</div>
				
				<div className='progress'>
					<div className='bar' style={{width: this.state.percent + '%' }}></div>
				</div>
				
				<div className='percent'>{this.state.percent}%</div>
			</div>
   		)
	}
}
