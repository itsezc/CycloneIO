import React , {Component} from 'react'

import { classNames, dragElement } from '../../utils/functions';

type DialogProps = {
    defaultPos?: []
    subHeader?: boolean
    axis?: any
    resize?: boolean
    styles?: {}
    minHeight?: number
    minWidth?: number
    show?: boolean
    className?: string

    id: string
    title: string
    children?: any
    width: number
    height: number
}

export default class Dialog extends Component<DialogProps, any> {

	static defaultProps = {
        defaultPos: [64, 64],
        subHeader: false,
        resize: false
    }

    private styles: {}
    private minHeight: number
    private minWidth: number

	constructor(props: DialogProps) {
		super(props);

		this.styles = props.styles || {}
		this.minHeight = props.minHeight || props.height;
		this.minWidth = props.minWidth || props.width;

		this.state = {
			isShow: props.show || true,

			isResizing: false,
            isDragging: false,
            
            style: {
                width: props.width,
                height: props.height,
                top: 64,
                left: 64
            }
		}
	}

	componentDidUpdate(props: any, state: any){

        if ((this.state.isDragging && !state.isDragging)  || (this.state.isResizing && !state.isResizing)) {
            document.addEventListener('mousemove', this.handleMouse)
            document.addEventListener('mouseup', this.mouseStopEvent)
            
        } else if (!this.state.isDragging && state.isDragging) {
            document.removeEventListener('mousemove', this.handleMouse)
            document.removeEventListener('mouseup', this.mouseStopEvent)
        }
    }

	handleDragging = () => {
        this.setState({
          isDragging: true
        })
    }

	handleResizing = () => {
        this.setState({
            isResizing: true
        })
    }

	mouseStopEvent = () => {

        if(this.state.isResizing) {

            this.setState({...this.state,
                isResizing: false
            })

        } else if(this.state.isDragging) {

            this.setState({...this.state,
                isDragging: false
            })

        }
    }

	handleMouse = (e: MouseEvent) => {
        
        if (!this.state.isDragging && !this.state.isResizing) return

        if(this.state.isDragging){

            this.setState({...this.state,
                style: {
                    ...this.state.style,
                    top: this.state.style.top + e.movementY,
                    left: this.state.style.left + e.movementX
                }
            })

        } else if(this.state.isResizing){
            
            var width, height;

            var constraintX = this.props.axis == 'x' || this.props.axis == 'both';
            var constraintY = this.props.axis == 'y' || this.props.axis == 'both';

            width = this.state.style.width + e.movementX;
			if(width < this.minWidth) return

            height = this.state.style.height + e.movementY;
			if(height < this.minHeight) return
			

            this.setState({...this.state,
                style: {
                    ...this.state.style,
                    width: constraintX ? width : this.state.style.width,
                    height: constraintY ? height : this.state.style.height
                }
            })
        }
    }

	toggleShow = () => {
		this.setState({
			isShow: !this.state.isShow
		});
	}

	close() {
		this.setState({
			isShow: false
		})
	}

	render() {
		if(this.state.isShow) {
			return (

				<section className={`dialog ${this.props.className || ''}`} id={this.props.id} style={this.state.style}>
					
					<div className='dialog-header' id={(this.props.id) ? (this.props.id).concat('_header') : undefined} onMouseDown={this.handleDragging.bind(this)}>
						<span>{this.props.title}</span>
						<i className='close' onClick={this.close.bind(this)}>x</i>
					</div>

					<div className='dialog-body'>
						{this.props.children}

						{this.props.resize &&
							<i className="dialog-resizehandle" onMouseDown={this.handleResizing.bind(this)}></i>
						}
					</div>
				</section>
			)
		} else {
			return null
		}
		
	}
}