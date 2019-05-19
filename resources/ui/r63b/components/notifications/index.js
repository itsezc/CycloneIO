import React, {Component} from 'react';

import Wallet from './components/wallet';

export default class Notification extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="notifications">
				<Wallet />
			</div>
        )
    }
}