import React from 'react';

import Dialog from '../../components/dialog';
import Scrollbar from '../../components/scrollbar';

import { Tab, TabHeader, TabContent } from '../../components/tab';

var NavigatorGroup = (props) => {
    return (
        <div className="navigator-group">

            <div className="navigator-group-header">
                <i className="icon icon-plus"></i>
                <h2>{props.title}</h2>

                <div className="navigator-group-header-actions">
                    <i className="icon icon-search"></i>
                    
                    <button className="btn btn-saved">
                        <i className="icon icon-storm"></i>
                    </button>
                </div>
            </div>

            <ul className="navigator-group-content">

                <li className="navigator-room">

                    <div className="navigator-room-users">
                        <i className="icon icon-user"></i>46
                    </div>

                    <h3>Club NX</h3>

                    <div className="navigator-room-infos">
                        <i className="icon icon-info"></i>
                    </div>
                </li>

                <li className="navigator-room">

                    <div className="navigator-room-users">
                        <i className="icon icon-user"></i>46
                    </div>

                    <h3>Club NX</h3>

                    <div className="navigator-room-infos">
                        <i className="icon icon-info"></i>
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default class Navigator extends React.PureComponent {

    render(){
        return (
            <Dialog title="Navigator" className="navigator">

                <div className="dialog-tabs">

                    <button className="btn btn-saved dialog-tabs-subaction">
                        <i className="icon icon-storm"></i>
                    </button>
                    
                    <ul className="dialog-tabs-actions">
                        <li>Public</li>
                        <li className="is-active">All Rooms</li>
                        <li>Events</li>
                        <li>My World</li>
                    </ul>
                </div>

                <div className="dialog-content">

                    <div className="dialog-filter">

                        <select className="dropdown">
                            <option>Anything</option>
                            <option>Room Name</option>
                            <option>Owner</option>
                            <option>Tag</option>
                            <option>Group</option>
                        </select>

                        <input className="input" placeholder="filter rooms by..." />
                    </div>

                    <Scrollbar className="navigator-content">

                        <NavigatorGroup title="Most Popular Rooms" />
                        <NavigatorGroup title="Recommended For You" />
                        <NavigatorGroup title="Trading" />
                        <NavigatorGroup title="Party" />
                        <NavigatorGroup title="Chat and discussion" />
                        <NavigatorGroup title="Habbo Games" />
                    </Scrollbar>


                    <div className="navigator-actions">

                        <div className="navigator-actions-room">
                            <i className="icon icon-room-plus">Create Room</i>
                        </div>

                        <div className="navigator-actions-new">
                            <i className="icon icon-room-swap">Somewhere new</i>
                        </div>
                    </div>
                </div>
            </Dialog>
        )
    }
}