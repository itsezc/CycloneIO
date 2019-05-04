import React, { Component } from 'react'
import { fullScreen } from '../../utils/class.functions'

export default class Actions extends Component {
	constructor(props) {
		super(props)
	}

	render() {
		return (
			<div className='actions'>
				<button className='action'>FS</button>
			</div>
		)
	}
}