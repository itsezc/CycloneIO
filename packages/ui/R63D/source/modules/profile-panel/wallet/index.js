import React from 'react';

export default class Wallet extends React.Component {

    render(){
        return (
            <div className="wallet frame-200">

                <div className="wallet-currencies">
                    <i className="icon icon-diamond">0</i>
                    <i className="icon icon-credit">0</i>
                    <i className="icon icon-ducket">898</i>
                </div>

                <div className="wallet-club">
                    <i className="icon icon-hc"></i> Join
                </div>

                <div className="wallet-actions">
                    <button className="btn btn-flat-stripe btn-blue">Help</button>
                    <button className="btn btn-flat-stripe btn-danger"><i className="icon icon-exit"></i></button>
                    <button className="btn btn-flat-stripe btn-info"><i className="icon icon-gear"></i></button>
                </div>
            </div>
        )
    }
}