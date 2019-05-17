import React , {Component} from 'react'

import { classNames, dragElement } from '../../utils/functions';

type Props = {
    title: string,
    style: ?string,
	id: ?int,
	draggable: ?boolean,
	closeable: ?boolean,
}

export default class Dialog extends Component<Props> {

	constructor(props) {
		super(props)

		this.styles = props.styles || {}
		this.styles.alert = true

		this.state = {
			show: props.show || true,
			draggable: props.draggable,
			closeable: props.closeable,
		}
	}

	componentDidMount() {
		if(this.state.draggable) {
			dragElement(document.getElementById(this.props.id))
		}
	}

	show() {
		this.setState({ show: true })
	}

	close() {
		this.setState({ show: false })
	}

	render() {
		return (

			<section className={`dialog ${this.props.className || ''}`} id={this.props.id}>
				
				<div className="dialog-header" id={(this.props.id) ? (this.props.id).concat('_header') : null}>
					<span>{this.props.title}</span>
				</div>

				<div className="dialog-body">
					{this.props.children}
				</div>
			</section>
		)
	}
}

