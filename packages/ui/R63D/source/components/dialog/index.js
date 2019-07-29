import React from 'react';
import Dragable from '../dragable';

export default class Dialog extends Dragable {

    render(){
        return (

            <div className="dialog" style={this.generateStyle()}>

                <div className="dialog-header" onMouseDown={this.startDraging}>
                    <h3>{this.props.title}</h3>

                    <div className="dialog-header-actions">
                        
                        <button className="btn btn-r63b btn-action btn-red">
                            <i className="icon icon-close"></i>
                        </button>

                        <button className="btn btn-r63b btn-action btn-blue">
                            <i className="icon icon-help"></i>
                        </button>
                    </div>
                </div>

                <div className="dialog-content">
                    {this.props.children}
                </div>
            </div>
        )
    }
}