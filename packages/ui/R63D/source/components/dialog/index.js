import React from 'react';

import Draggable from '../draggable';

export default class Dialog extends React.PureComponent {

    constructor(props){
        super(props);
    }

    render(){
        return (

            <Draggable {...this.props}>
                {(styleDragable, startDraging) => (

                    <div className={"dialog" + (this.props.className ? ' ' + this.props.className : '')} style={styleDragable}>

                        <div className="dialog-header" onMouseDown={startDraging}>
                            <h3>{this.props.title}</h3>

                            <div className="dialog-header-actions">
                                
                                {this.props.needHelp &&
                                    <button className="btn btn-r63b btn-action btn-blue">
                                        <i className="icon icon-help"></i>
                                    </button>
                                }

                                <button className="btn btn-r63b btn-action btn-red">
                                    <i className="icon icon-close"></i>
                                </button>
                            </div>
                        </div>

                        <div className="dialog-wrapper">
                            {this.props.children}
                        </div>
                    </div>
                )}
            </Draggable>
        )
    }
}