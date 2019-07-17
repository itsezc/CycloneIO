import React , {Component} from 'react'

import { classNames, dragElement } from '../../utils/functions';

type DialogProps = {
    defaultPos?: [] | string
    subHeader?: boolean
    axis?: any
    resize?: boolean
    styles?: {}
    minHeight?: number
    minWidth?: number
    show?: boolean
    className?: string
    background?: string
    closeable?: boolean

    id: string
    title: string
    children?: any
    width: number
    height: number

    centered?: boolean
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

    private screenHeight: number
    private screenWidth: number
    private closeable: boolean

	constructor(props: DialogProps) {
		super(props)

		this.styles = props.styles || {}
		this.minHeight = props.minHeight || props.height
        this.minWidth = props.minWidth || props.width
        
        this.closeable = props.closeable || false

        this.handleScreenResize()

		this.state = {
			isShow: props.show || true,

			isResizing: false,
            isDragging: false,
            
            style: {
                width: props.width,
                height: props.height,
                top: props.centered || 64,
                left: props.centered || 64
            }
        }
    
    }
    
    closeButton() {
        return(
            <i className='close' onClick={this.close.bind(this)}>x</i> 
        )
    }

	componentWillMount() {

        document.addEventListener('mousemove', this.handleMouse)
        document.addEventListener('mouseup', this.mouseStopEvent)
        window.addEventListener('resize', this.handleScreenResize)
    
    }

    componentWillUnmount()  {

        document.removeEventListener('mousemove', this.handleMouse)
        document.removeEventListener('mouseup', this.mouseStopEvent)
        window.removeEventListener('resize', this.handleScreenResize)
    
    }

    handleScreenResize = () => {
        this.screenHeight = window.innerHeight
        this.screenWidth = window.innerWidth
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

            const top = this.state.style.top + e.movementY
            const left =  this.state.style.left + e.movementX

            if( top <= 0 || top >= this.screenHeight - this.state.style.height || 
                left <= 0 || left >= this.screenWidth - this.state.style.width) return

            this.setState({...this.state,
                style: {
                    ...this.state.style,
                    top,
                    left
                }
            })

        } else if(this.state.isResizing) {
            
            var width, height;

            var constraintX = this.props.axis == 'x' || this.props.axis == 'both'
            var constraintY = this.props.axis == 'y' || this.props.axis == 'both'

            width = this.state.style.width + e.movementX
			if(width < this.minWidth) return

            height = this.state.style.height + e.movementY
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

				<dialog className={`dialog ${this.props.className || ''}`} id={this.props.id} style={this.state.style}>
					
					<div className='dialog-header' id={(this.props.id) ? (this.props.id).concat('_header') : undefined} onMouseDown={this.handleDragging.bind(this)}>
						<span>{this.props.title}</span>
                        {/* { this.closeable ? this.closeButton() : false }  */}

                        {/* <button className="btn btn-r63b btn-action btn-red">
                            <i className="icon icon-close"></i>
                        </button>

                        <button className="btn btn-r63b btn-action btn-blue">
                            <i className="icon icon-help"></i>
                        </button> */}
					</div>

					<div className='dialog-body'>
						{this.props.children}

						{this.props.resize &&
							<i className='dialog-resizehandle' onMouseDown={this.handleResizing.bind(this)}></i>
						}
					</div>
				</dialog>
			)
		} else {
			return null
		}
		
	}
}