import React from 'react';

export default class ChatBubble extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="chat-bubble">

                <div className="chat-bubble-avatar">
                    <img src="https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=Pulx&headonly=1&direction=2&head_direction=2&action=&gesture=&size=m" />
                </div>

                <p className="chat-bubble-content"><b>Textarea:</b>Hello</p>

                <i className="chat-buble-arrow"></i>
            </div>
        )
    }
}