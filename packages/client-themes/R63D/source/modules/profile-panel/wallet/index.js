import React from 'react';

export default class Wallet extends React.Component {

    render(){
        return (
            <div className="wallet ui-200">

                <div className="wallet-currencies">
                    <span className="currency-diamond">0<i className="icon icon-diamond"></i></span>
                    <span className="currency-credit">0<i className="icon icon-credit"></i></span>
                    <span className="currency-ducket">898<i className="icon icon-ducket"></i></span>
                </div>

                <div className="wallet-club">
                    <i className="icon icon-hc"></i> Join
                </div>

                <div className="wallet-actions">
                    <button className="btn btn-small btn-flat btn-blue">Help</button>
                    <button className="btn btn-small btn-flat btn-red"><i className="icon icon-exit"></i></button>
                    <button className="btn btn-small btn-flat btn-gray"><i className="icon icon-gear"></i></button>
                </div>
            </div>
        )
    }
}