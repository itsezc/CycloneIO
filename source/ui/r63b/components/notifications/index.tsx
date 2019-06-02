import React, {Component} from 'react';

import Wallet from '../wallet';
import Notification from './components/notification';

export default class Notifications extends React.Component {

    constructor(props: any){
        super(props);
    }

    render(){
        return (
            <div className="notifications">
				<Wallet />

                <Notification icon="offer">
                    <b>50 percent off 14 days HC+20c+20d</b>
                </Notification>

                <Notification icon="hc">
                    <u>Receive 5 Credits discount when you renew your HC Subscription here!</u>
                </Notification>
			</div>
        )
    }
}