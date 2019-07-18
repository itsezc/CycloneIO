import React from 'react';
import ClickActions from '../';

export default class UserActions extends React.PureComponent {

    constructor(props){
        super(props);

        this.state = {
            defaultPage: 0
        }
    }

    render(){
        return (

            <ClickActions className="user-actions" {...this.props}>
                 {(() => {
                    
                    switch(this.state.defaultPage){
                        case 0: return (
                            <>
                                <li><span>Trade</span></li>
                                <li><span>Whisper</span></li>
                                <li><span>Give respect (3)</span></li>
                                <li onClick={() => this.setState({ defaultPage: 1 })}><span>Relationship</span><i className="icon icon-carret-right"></i></li>
                                <li><span>Ignore</span></li>
                                <li><span>Report</span></li>
                                <li><span>Give hand item</span></li>
                            </>
                        )

                        case 1: return (
                            <>
                                <ul className="click-actions-grid">
                                    <li><i className="icon icon-relation-heart"></i></li>
                                    <li><i className="icon icon-relation-friend"></i></li>
                                    <li><i className="icon icon-relation-skull"></i></li>
                                </ul>
                                <li><span>Clear relationship</span></li>
                                
                                <li onClick={() => this.setState({ defaultPage: 0 })}>
                                    <i className="icon icon-carret-left"></i>
                                    <span>Actions</span>
                                </li>
                            </>
                        )
                    }
                })()}
            </ClickActions>
        )
    }
}