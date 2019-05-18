import React, { Component } from 'react'

import FriendSlot from './components/FriendSlot';

export default class Toolbar extends Component {

	constructor(props) {
		super(props)
	}

	render() {
		return (
            <section className="toolbar">
                <div className="toolbar-icons">
                    <i className="toolbar-more" />

                    <div className="toolbar-icons-content">
                        <span className="icon icon-house is-active" />
                        <span className="icon icon-rooms" />
                        <span className="icon icon-catalogue" />
                        <span className="icon icon-buildersclub" />
                        {false ? (
                            <span className="icon-inventory" />
                        ) : (
                            ''
                        )}

                        <span className="user">
                            <i className="notification">3</i>
                            <img src="https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=Textarea&headonly=0&direction=2&head_direction=2&action=&gesture=&size=m" />
                        </span>
                    </div>
                </div>

                <div className="toolbar-friends is-open">
                    <div className="toolbar-icons-content">
                        <span className="icon icon-friendall" />
                        <span className="icon icon-friendsearch" />
                    </div>

                    <div className="toolbar-friends-content">
                        <FriendSlot username="Specimen:" />
                        <FriendSlot type="unknown" />
                        <FriendSlot type="unknown" />
                        <FriendSlot type="unknown" />
                    </div>

                    <i className="toolbar-more is-open" />
                </div>
            </section>
        );
	}
}