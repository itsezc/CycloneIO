import React from 'react';

export default class ClickActions extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isOpen: true
        }
    }

    toggleOpen = () => {
        this.setState({ isOpen: !this.state.isOpen });
    }

    render(){
        return (
            <div className={"click-actions" + (this.props.isOwn ? " is-own" : '') + (this.state.isOpen ? " is-open" : '')}
                style={this.props.style}>

                {this.state.isOpen &&
                    <>
                        <h3 className="click-actions-header">Sarah</h3>
                
                        <div className="click-actions-content">
                            <a href="#">Ride</a>
                            <a href="#">Anyone can ride</a>
                            <a href="#">Scratch (3)</a>
                            <a href="#">Train<i className="icon icon-carret-right"></i></a>
                            <a href="#">Pick up<i className="icon icon-carret-right"></i></a>
                            <a href="#">Remove Saddle</a>
                        </div>
                    </>
                }
    
                <div className="click-actions-footer" onClick={this.toggleOpen}>
                    <i className={"icon " + (this.state.isOpen ? "icon-carret-down" : "icon-carret-up")}></i>
                </div>
            </div>
        )
    }
}