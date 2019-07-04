import React from 'react';

export default class ClickActions extends React.Component {

    render(){
        return (

            <div className="click-actions">
                <h3 className="click-actions-header">Sarah</h3>

                <div className="click-actions-content">
                    <a href="#">Ride</a>
                    <a href="#">Anyone can ride</a>
                    <a href="#">Scratch (3)</a>
                    <a href="#">Train</a>
                    <a href="#">Pick up</a>
                    <a href="#">Remove Saddle</a>
                </div>

                <div className="click-actions-footer">
                    <i className="icon icon-carret-down"></i>
                </div>
            </div>
        )
    }
}