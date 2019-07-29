import React from 'react';

export default class Dragable extends React.PureComponent {

    constructor(props){
        super(props);

        this.state = {
            isDragging: false,
            x: undefined,
            y: undefined,
        }
    }

    componentWillMount() {
        document.addEventListener('mousemove', this.handleDraging);
        document.addEventListener('mouseup', this.stopDraging);
    }

    componentWillUnmount() {
        document.removeEventListener('mousemove', this.handleDraging);
        document.removeEventListener('mouseup', this.stopDraging);
    }

    startDraging = (e) => {

        this.draggingRel = { x: e.pageX, y : e.pageY };
        this.setState({ isDragging: true });
    }

    handleDraging = (e) => {
        
        if(!this.state.isDragging) return;
        
        const newX = this.draggingRel.x + e.pageX;
        const newY = this.draggingRel.y + e.pageY;

        this.setState({ x: newX, y: newY });
    }

    stopDraging = () => {

        if(!this.state.isDragging) return;
        this.setState({ isDragging: false });
    }

    generateStyle = () => {
        return { top: this.state.y, left: this.state.x };
    }

}