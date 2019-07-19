import React from 'react';

import UserActions from '../user';
import ClickActions from '../';

export default class UserOwnActions extends UserActions {
    
    constructor(props){
        super(props);

        this.state = {
            defaultPage: 0
        }
    }

    render(){
        return (

            <ClickActions className="user-actions" {...this.props} isOwn={true}>
                {(() => {
                    
                    switch(this.state.defaultPage){
                        case 0: return (
                            <>
                                <li><span>Decorate Room</span></li>
                                <li><a>Change Looks</a></li>

                                <li onClick={() => this.setState({ defaultPage: 1 })}>
                                    <span>Actions</span>
                                    <i className="icon icon-carret-right"></i>
                                </li>

                                <li onClick={() => this.setState({ defaultPage: 2 })}>
                                    <span>Dance</span>
                                    <i className="icon icon-carret-right"></i>
                                </li>

                                <li onClick={() => this.setState({ defaultPage: 3 })}>
                                    <span>Sign</span>
                                    <i className="icon icon-carret-right"></i>
                                </li>
                            </>
                        );

                        case 1: return (
                            <>
                                <li><span>Sit</span></li>
                                <li><span>Wave</span></li>
                                <li><span>Blow Kiss</span></li>
                                <li><span>Laugh</span></li>
                                <li><span>Idle</span></li>

                                <li onClick={() => this.setState({ defaultPage: 0 })}>
                                    <i className="icon icon-carret-left"></i>
                                    <span>Back</span>
                                </li>
                            </>
                        );

                        case 2: return (
                            <>
                                <li disabled><span>Stop Dancing</span></li>
                                <li><span>Dance</span></li>
                                <li><span>Pogo Mogo</span></li>
                                <li><span>Duck Funk</span></li>
                                <li><span>The Rollie</span></li>
                                
                                <li onClick={() => this.setState({ defaultPage: 0 })}>
                                    <i className="icon icon-carret-left"></i>
                                    <span>Back</span>
                                </li>
                            </>
                        );

                        case 3: return (
                            <>
                                <ul className="click-actions-grid">
                                    <li>0</li>
                                    <li>1</li>
                                    <li>2</li>
                                    <li>3</li>
                                    <li>4</li>
                                    <li>5</li>
                                    <li>6</li>
                                    <li>7</li>
                                    <li>8</li>
                                    <li>9</li>
                                    <li>10</li>
                                    <li><i className="icon icon-sign-heart"></i></li>
                                    <li><i className="icon icon-sign-skull"></i></li>
                                    <li><i className="icon icon-sign-exclamation"></i></li>
                                    <li>:)</li>
                                    <li><i className="icon icon-sign-football"></i></li>
                                    <li><i className="icon icon-sign-yellowcard"></i></li>
                                    <li><i className="icon icon-sign-redcard"></i></li>
                                </ul>

                                <li onClick={() => this.setState({ defaultPage: 0 })}>
                                    <i className="icon icon-carret-left"></i>
                                    <span>Back</span>
                                </li>
                            </>
                        )
                    }
                })()}
                
            </ClickActions>
        )
    }
}