import React from 'react';
import Dragable from '../../components/dragable';

export default class Camera extends Dragable {

    render(){
        return (

            <div className="camera" onMouseDown={this.startDraging}>

            </div>
        )
    }
}