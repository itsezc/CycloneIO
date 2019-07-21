import React from 'react';

export default class RoomDetails extends React.PureComponent {

    constructor(props){
        super(props);

        this.state = {
            isOpen: false,
            isInformationsOpen: true
        }
    }

    componentDidMount = () => {
        this.startTimerCloseInformations();
    }

    startTimerCloseInformations = () => {

        setTimeout(() => {
            this.setState({ isInformationsOpen: false });
        }, 2000);
    }

    toggleOpen = () => {
        
        this.setState({ isOpen: !this.state.isOpen }, () => {
            
            if(this.state.isOpen){
                this.setState({ isInformationsOpen: true }, this.startTimerCloseInformations);
            }
        });
    }

    render(){
        return (
            <div className={"room-details" + (this.state.isOpen ? " is-open": "")}>
                <i className={"more"  + (!this.state.isOpen ? " is-close" : '')} onClick={this.toggleOpen}></i>

                <div className="room-details-actions">
                    <a href="#" className="icon icon-gear-detailed">Settings</a>
                    <a href="#" className="icon icon-zoom">Zoom</a>
                    <a href="#" className="icon icon-small icon-messages" onClick={this.props.toggleChatHistory}>Chat history</a>
                    {this.props.isOwner &&
                        <a href="#" className="icon icon-like">Like</a>
                    }
                    <a href="#" className="icon icon-arrow-right">Link to this room</a>

                    <div className="room-details-history">
                        <span className="history-btn history-previous"></span>
                        <span className="history-btn history-next"></span>
                    </div>
                </div>

                <div className={"room-details-informations" + (this.state.isInformationsOpen ? " is-open": "")}>
                    <h2>!!!</h2>
                    <small>by EZ-C2</small>
                </div>
            </div>
        )
    }
}