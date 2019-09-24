import React from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export default class Scrollbar extends React.PureComponent {

    constructor(props){
        super(props);

        this.state = {
            thumbHeight: 0,
            thumbTop: 0,
            isDragingY: null
        }
    }

    componentDidMount(){

        this.computeData();
        this.handleResizing();

        this.content.addEventListener('scroll', this.visualizationScrolling);
        document.addEventListener('mousemove', this.handleDrag);
        document.addEventListener('mouseup', this.endDragging);
    }

    componentWillUnmount(){

        this.content.removeEventListener('scroll', this.visualizationScrolling);
        document.removeEventListener('mousemove', this.handleDrag);
        document.removeEventListener('mouseup', this.endDragging);
    }

    computeData = (callback = null) => {

        this.trackHeight = this.trackRef.clientHeight;
        this.scrollMaxY = this.content.scrollHeight - this.content.clientHeight;

        let thumbHeight = this.getThumbVerticalHeight();
        this.thumbMaxY = this.trackHeight - thumbHeight;

        this.setState({ thumbHeight });

        if(callback != null && typeof callback == 'function')
            callback();
    }

    getThumbVerticalHeight = () => {

        const { trackHeight } = this;
        let { scrollHeight, clientHeight } = this.content;

        if(scrollHeight == 0 || clientHeight == 0) 
            return 0;
        
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

    visualizationScrolling = (e) => {
        
        const thumbTop = this.thumbMaxY * this.content.scrollTop / this.scrollMaxY;

        this.setState({
            thumbTop
        })
    }

    moveThumbToMouse(event){

        const { thumbTop } = this.state;
        const { target, clientY } = event;

        const rect = target.getBoundingClientRect();

        const mouseY = clientY - rect.top;
        this.scrollRatio((mouseY > thumbTop) ? 1 : -1);
    }

    startDragging = (event) => {

        event.persist();
        event.stopPropagation();

        this.setState({ isDragingY: event.clientY, defaultPos: this.content.scrollTop })
    }

    endDragging = () => {
        this.setState({ isDragingY: null })
    }

    handleDrag = (event) => {

        if(this.state.isDragingY == null) return;
        
        const diff = event.clientY - this.state.isDragingY;
        const scrollValue = diff * this.scrollMaxY / this.thumbMaxY;

        this.scrollTo(this.state.defaultPos + scrollValue);
    }

    handleResizing = () => {

        const observer = new ResizeObserver(function(){
            this.computeData(this.visualizationScrolling);
        }.bind(this));

        observer.observe(this.content);
    }

    render(){
        return (
            <div className={"scroll" + (this.props.className ? ' ' + this.props.className : '')}>
                
                <div className="scroll-wrapper">
                    <div className="scroll-wrapper-content" ref={(ref) => {this.content = ref}}>
                        {this.props.children}
                    </div>
                </div>

                <div className="scrollbar">

                    <button className="scrollbar-button scrollbar-button-increment" onMouseDown={this.scrollToTop}>
                        <i className="icon icon-carret-up"></i>
                    </button>

                    <div className="scrollbar-track" ref={(ref) => {this.trackRef = ref}} onMouseDown={this.moveThumbToMouse.bind(this)}>

                        <div className="scrollbar-track-thumb" ref={(ref) => {this.thumbRef = ref}} onMouseDown={this.startDragging}
                            style={{height: this.state.thumbHeight, top: this.state.thumbTop}} ></div>
                    </div>

                    <button className="scrollbar-button scrollbar-button-decrement" onMouseDown={this.scrollToBottom}>
                        <i className="icon icon-carret-down"></i>
                    </button>
                </div>
            </div>
        )
    }
}