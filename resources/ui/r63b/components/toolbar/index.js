import React, { Component } from 'react'

import FriendSlot from './components/friendSlot';

export default class Toolbar extends Component {

	constructor(props) {
		super(props)

        this.state = {
            isFriendsOpen: true,
            isActionsOpen: true
        }
	}

    toggleFriends(){
        this.setState({
            isFriendsOpen: !this.state.isFriendsOpen
        })
    }

    toggleActions(){
        this.setState({
            isActionsOpen: !this.state.isActionsOpen
        })
    }

	render() {
		return (
            <section className={"toolbar" + (this.props.isClient ? " is-client" : '')}>

                <div className="toolbar-actions">
                    <i className={"toolbar-more" + (!this.state.isActionsOpen ? " is-close" : '')} onClick={this.toggleActions.bind(this)}></i>

                    <div className="toolbar-icons-content">
                        {this.state.isActionsOpen ?
                            (!this.props.isClient ? <span className="icon icon-house"></span> : <span className="icon icon-habbo"></span>)
                        : null}
                        {this.state.isActionsOpen && <span className="icon icon-rooms"></span>} 
                        
                        <span className="icon icon-catalogue"></span>
                        <span className="icon icon-buildersclub"></span>

                        {!this.state.isActionsOpen && <span className="icon icon-inventory"></span>}

                        <span className="user">
                            <i className="notification">3</i>
                            <img src="https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=Textarea&headonly=0&direction=2&head_direction=2&action=&gesture=&size=m" />
                        </span>

                        {this.props.isClient && <span className="icon icon-camera"></span> }
                    </div>
                </div>

                <div className="toolbar-friends">

                    <div className="toolbar-icons-content">
                        <span className="icon icon-friendall">
                            <i className="notification">3</i>
                        </span>
                        <span className="icon icon-friendsearch"></span>
                        <span className={"icon icon-message" + (false ? " is-unsee" : '')}></span>
                    </div>

                    {this.state.isFriendsOpen &&
                        <div className="toolbar-friends-content">
                            <FriendSlot username='EZ-C' />
                            <FriendSlot username='EZ-C2' />
                            <FriendSlot type="unknown" />
                            <FriendSlot type="unknown" />
                        </div>
                    }

                    <i className={"toolbar-more" + (!this.state.isFriendsOpen ? " is-close" : '')} onClick={this.toggleFriends.bind(this)}></i>
                </div>
            </section>
        );
	}
}