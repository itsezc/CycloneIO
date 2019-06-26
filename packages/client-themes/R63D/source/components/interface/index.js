import React from 'react';
import { withRouter } from "react-router";

import Toolbar from '../../modules/toolbar';
import ProfilePanel from '../../modules/profile-panel';
import WebAction from '../../modules/web-action';

class Interface extends React.Component {

    constructor(props){
        super(props);
    }

    render(){

        const isRoom = (this.props.location.pathname.includes('room'));

        return (
            <main className={"client" + (isRoom ? " is-room" : '')}>

                {this.props.children}

                <WebAction isRoom={isRoom}/>
                <ProfilePanel isRoom={isRoom}/>
                <Toolbar isRoom={isRoom} />
            </main>
        )
    }
}

export default withRouter(Interface);