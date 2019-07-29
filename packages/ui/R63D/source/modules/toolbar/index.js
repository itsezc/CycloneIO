import React from 'react';

import Friends from './friends';
import ChatBox from '../../modules/chat-box';

export default class Toolbar extends React.Component {

	constructor(props) {
		super(props)

        this.state = {
            isFriendsOpen: true,
            isActionsOpen: true,
            isUserActionsOpen: false
        };
	}

    toggleFriends(){
        this.setState({
            isFriendsOpen: !this.state.isFriendsOpen
        });
    }

    toggleActions(){
        this.setState({
            isActionsOpen: !this.state.isActionsOpen
        });
    }

    toggleUserActions(){
        this.setState({
            isUserActionsOpen: !this.state.isUserActionsOpen
        });
    }

	render() {
		return (
            <section className={"toolbar"}>

                <div className="toolbar-actions">
                    <i className={"more" + (!this.state.isActionsOpen ? " is-close" : '')} onClick={this.toggleActions.bind(this)}></i>

                    <div className="toolbar-icons-content">
                        {this.state.isActionsOpen ?
                            (!this.props.isRoom ? <span className="icon icon-house"></span> : <span className="icon icon-habbo"></span>)
                        : null}
                        {this.state.isActionsOpen && <span className="icon icon-rooms"></span>} 
                        
                        <span className="icon icon-catalog"></span>
                        <span className="icon icon-buildersclub"></span>

                        {!this.state.isActionsOpen && <span className="icon icon-inventory"></span>}

                        <figure className="user" onClick={this.toggleUserActions.bind(this)}>
                            <i className="notification">3</i>
                            <img src='https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=EZ-C&headonly=0&direction=2&head_direction=2&action=&gesture=&size=m' />
                        </figure>

                        {this.props.isRoom && <span className="icon icon-camera"></span> }
                    </div>

                    <div className={"toolbar-user-actions" + (this.state.isUserActionsOpen ? " is-active": "")}>
                        <span className="icon icon-talents">Talents</span>
                        <span className="icon icon-achievements">Achievements</span>
                        <span className="icon icon-minimail">Minimail</span>
                        <span className="icon icon-myprofile">My Profile</span>
                        <span className="icon icon-myrooms">My Rooms</span>
                        <span className="icon icon-clothes">Clothes</span>
                        <span className="icon icon-forums">Forums</span>
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
                        <Friends friends={['Markos', 'madison042', 'Phishi', 'PrettyJahanvi', 'Chaosmyyyth', 'EZ-C', 'Maegel']} />
                    }

                    <i className={"more is-invert" + (!this.state.isFriendsOpen ? " is-close" : '')} onClick={this.toggleFriends.bind(this)}></i>
                </div>
            </section>
        );
	}
}