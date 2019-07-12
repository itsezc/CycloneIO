import React, { Component } from 'react'

interface Props {
	props: any
}

interface State {
	thumbHeight: number
	thumbTop: number
	isDraggingY: any
	defaultPos: number
}

export default class Scrollbar extends Component <Props, State> 
{

	public trackHeight: any
	public trackRef: any
	public scrollMaxY!: number
	public thumbMaxY!: number
	public content: any
	public thumbHeight!: number
	public thumbRef!: any
	public computeData: any

	constructor(props: any) 
	{
        super(props)

        this.state = {
            thumbTop: 0,
			thumbHeight: 0,
			isDraggingY: null,
			defaultPos: 0
        }
    }

    componentDidMount() {

        this.trackHeight = this.trackRef.clientHeight;

        this.scrollMaxY = this.content.scrollHeight - this.content.clientHeight;

        const thumbHeight = this.getThumbVerticalHeight();
        this.thumbMaxY = this.trackHeight - thumbHeight;

        this.content.addEventListener('scroll', this.visualizationScrolling);
        window.addEventListener('resize', this.computeData);

        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.endDragging);

        this.setState({
            thumbHeight
        });
    }

    getThumbVerticalHeight = () => {

        const { trackHeight } = this;
        const { scrollHeight, clientHeight } = this.content;

        return Math.ceil(clientHeight / scrollHeight * trackHeight);
    }

    scrollToTop = () => {
        this.scrollRatio(-1, 50);
    }

    scrollToBottom = () => {
        this.scrollRatio(1, 50);
    }

    scrollTo(value = 0){
        this.content.scrollTo(0, value);
    }

    scrollRatio(sign = 1, ratio = 150){
        this.scrollTo(this.content.scrollTop + ratio * sign);
    }

    visualizationScrolling = (e: any) => {
        
        const thumbTop = this.thumbMaxY * this.content.scrollTop / this.scrollMaxY;

        this.setState({
            thumbTop
        })
    }

	moveThumbToMouse(event: any) 
	{
		const { thumbTop } = this.state;
        const { target, clientY } = event;

        const rect = target.getBoundingClientRect();

        const mouseY = clientY - rect.top;
        this.scrollRatio((mouseY > thumbTop) ? 1 : -1);
    }

    startDragging = (event: any) => {

        event.persist();
        event.stopPropagation();

        this.setState({ isDraggingY: event.clientY, defaultPos: this.content.scrollTop })
    }

    endDragging = () => {
        this.setState({ isDraggingY: null })
    }

    handleDrag = (event: any) => {

        if(this.state.isDraggingY == null) return;
        
        const diff = event.clientY - this.state.isDraggingY;
        const scrollValue = diff * this.scrollMaxY / this.thumbMaxY;

        this.scrollTo(this.state.defaultPos + scrollValue);
    }

    render() {
        return (
            <div className='scroll'>
                
                <div className='scroll-wrapper'>
                    <div className='scroll-wrapper-content' ref={(ref) => {this.content = ref}}>
                        {this.props.children}
                    </div>
                </div>

                <div className='scrollbar' >
                    <button className='scrollbar-button scrollbar-button-increment' onMouseDown={this.scrollToTop}>
                        b
                    </button>

                    <div className='scrollbar-track' ref={(ref) => {this.trackRef = ref}} onMouseDown={this.moveThumbToMouse.bind(this)}>

                        <div className='scrollbar-track-thumb' ref={(ref) => {this.thumbRef = ref}} onMouseDown={this.startDragging}
                            style={{height: this.state.thumbHeight, top: this.state.thumbTop}} ></div>
                    </div>

                    <button className='scrollbar-button scrollbar-button-decrement' onMouseDown={this.scrollToBottom}>
                        a
                    </button>
                </div>
            </div>
        )
    }
}