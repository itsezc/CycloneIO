import React from 'react';

import Wallet from './wallet';

export default class ProfilePanel extends React.Component {

    render(){
        return (
            <div className="profile-panel">
                
                <Wallet />

                <div className="notifications">
                    
                    <div className="frame-200">a</div>
                    <div className="frame-200">b</div>
                    <div className="frame-200">c</div>
                </div>
            </div>
        )
    }
}