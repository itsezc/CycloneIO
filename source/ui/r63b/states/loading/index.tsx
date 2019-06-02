import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'

import './loading.styl'

type LoadingState = {
	percent: number
}

export default class Loading extends Component<any, LoadingState> {
	
	private interval!: NodeJS.Timeout

	constructor(props: any) {
		super(props)

		this.state = {
			percent: 0
		}
	}

	componentDidMount() {
		this.interval = setInterval(() => {
			this.setState({
				percent: this.state.percent + 10
			})
		}, 500)
	}

	componentWillUnmount() {
		clearInterval(this.interval)
	}

	render() {

		if(this.state.percent > 99) return <Redirect to='/hotel' />
		
		return(
   			 <div className='loading'>

   			 	<div className='splash'>
   					<div className='photo'></div>
   					<div className='frame'></div>
   				</div>

   			 	<div className='text'>Please wait while {this.props.hotelName} is loading</div>

   			 	<div className='loading-progress'>
   					<div className='bar' style={{width: this.state.percent + '%' }}></div>
   				</div>

   				<div className='percent'>{this.state.percent}%</div>
   			</div>
   		)
	}
}