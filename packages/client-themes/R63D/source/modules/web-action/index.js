import React from 'react';

export default class WebAction extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isFullScreen: false
        }
    }

    toggleFullscreen = (event) => {
        
        /*fullScreen(this.state.fullScreen)*/
        this.setState({ 
            isFullScreen: !this.state.isFullScreen 
        });
    }

    render() {
        return (
            <div className="web_actions">

                <button className='action-item action-item-arrow'>
                    <i className="icon icon-small icon-habbo"></i><span className="action-item-expand">WEB</span>
                </button>

                <button className='action-item' onClick={this.toggleFullscreen}>
                    <i className={"icon " + (this.state.isFullScreen ? "icon-disable-fs" : "icon-fs")}></i>
                </button>
            </div>
        )
    }
}