import React from 'react';

export default class TabHeader extends React.PureComponent {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <ul className="tab-header">
                <li className="tab-header-item">Public</li>
                <li className="tab-header-item is-active">All Rooms</li>
                <li className="tab-header-item">Events</li>
                <li className="tab-header-item">My World</li>
            </ul>
        );
    }
}
