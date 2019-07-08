import React from 'react';

export default class ChatBox extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isOpen: false
        }
    }

    toggleOpen(){
        this.setState({
            isOpen: !this.state.isOpen
        });
    }

    render(){
        return (
            <div className="chat-box">

                <div className="chat-style-picker">

                    <div className="chat-style-picker-button" onClick={this.toggleOpen.bind(this)}>
                        <i className="icon icon-carret-down-gray"></i>
                        <i className="icon icon-messages"></i>

                        <div className="chat-style-picker-arrow"></div>
                    </div>

                    <div className={"chat-style-picker-content" + (this.state.isOpen ?  " is-open" : '')}>
                        list of styles
                    </div>
                </div>

                <input type="text" className="chat-input" placeholder="Chiru, is the best manager." />

                <button className="btn btn-action btn-blue">
                    <i className="icon icon-help"></i>
                </button>
            </div>
        )
    }
}