import React, {Component} from 'react';

export default class Notification extends Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="notification basic">
                <i className={"icon icon-" + this.props.icon}></i>
                {this.props.children}
            </div>
        )
    }
}