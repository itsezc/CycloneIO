import React, {Component} from 'react';

type NotificationProps = {
    icon: string
}

export default class Notification extends Component<NotificationProps, any> {

    constructor(props: NotificationProps){
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