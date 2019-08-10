import React from 'react';
import Draggable from '../draggable';
import Resizable from '../resizable';

export default class Dialog extends React.PureComponent {

    render(){
        return (

            <Draggable>
                {(styleDragable, startDraging) => {

                    if(this.props.isResizable) {
                        return (
                            <Resizable>
                                {(styleResizable, startResizing) => (
                                    <div className="dialog" style={{...styleDragable, styleResizable}}>

                                        <div className="dialog-header" onMouseDown={startDraging}>
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

                                            <i className="dialog-resize-handle" onMouseDown={startResizing}></i>
                                        </div>
                                    </div>
                                )}
                            </Resizable>
                        )
                    } else return (

                        <div className={"dialog" + (this.props.className ? ' ' + this.props.className : '')} style={styleDragable}>

                            <div className="dialog-header" onMouseDown={startDraging}>
                                <h3>{this.props.title}</h3>

                                <div className="dialog-header-actions">
                                    
                                    <button className="btn btn-r63b btn-action btn-blue">
                                        <i className="icon icon-help"></i>
                                    </button>

                                    <button className="btn btn-r63b btn-action btn-red">
                                        <i className="icon icon-close"></i>
                                    </button>
                                </div>
                            </div>

                            <div className="dialog-wrapper">
                                {this.props.children}
                            </div>
                        </div>
                    )
                }}
            </Draggable>
        )
    }
}