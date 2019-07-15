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
							console.log(index, page.id, page.parent)
							return(
								(page.id === page.parent.id) ?
									<p key={index}>
										<img src={`./catalogue/icons/${page.icon}.png`} />
										{page.name}
									</p>
								:	null
							)
						})
						// console.log('Navigation', this.state.pages)
					}
				</div>
			</div>
		)
	}
}