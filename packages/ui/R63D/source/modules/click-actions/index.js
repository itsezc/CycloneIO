import React from 'react';

export default class ClickActions extends React.PureComponent {

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
            <div className={"click-actions" + (this.props.isOwn ? " is-own" : '') + (this.state.isOpen ? " is-open" : '') + (this.props.className ? " " + this.props.className : '')}
                style={this.props.style}>

                {this.state.isOpen &&
                    <>
                        <h3 className="click-actions-header">{this.props.title}</h3>
                
                        <ul className="click-actions-content">
                            {this.props.children}
                        </ul>
                    </>
                }
    
                <div className="click-actions-footer" onClick={this.toggleOpen}>
                    <i className={"icon " + (this.state.isOpen ? "icon-carret-down" : "icon-carret-up")}></i>
                </div>
            </div>
        )
    }
}