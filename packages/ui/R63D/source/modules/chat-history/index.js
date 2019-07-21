import React from 'react';

export default class ChatHistory extends React.PureComponent {

    render(){
        return (
            <section className="chat-history">
                
                <div className="chat-history-content">
                    
                </div>
                
                <div className="chat-history-scrollbar">
                    <div className="chat-history-scrollbar-track"></div>
                </div>

                <i className={"more"} onClick={this.props.close}></i>
            </section>
        )
    }
}