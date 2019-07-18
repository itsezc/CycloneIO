import React, { Component } from 'react'

import '../styles/navigation.styl'

export default class Navigation extends Component<any, any> {

	constructor(props: any) {
		super(props)

		this.state = {
			pages: props.pages
		}
	}

	render() {
		return (
			<div className='navigation'>
				<div className='container'>
					{
						this.state.pages.map((page: any, index: number) => {
							return(
								(page.parent) ?
									<div className='option' key={index}>
										<img src={`./catalogue/icons/${page.icon}.png`} />
										<p>{page.name}</p>
									</div>
								:	null
							)
						})
					}
				</div>
			</div>
		)
	}
}