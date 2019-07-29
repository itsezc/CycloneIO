import React from 'react';

export default class FurnitureInfos extends React.PureComponent {

    render(){
        return (
            <React.Fragment>

                <div className="furniture-item frame-100">
                    <div className="frame-header">
                        <h3>Golden Apple</h3>

                        <button className="btn btn-volter btn-action">
                            <i className="icon icon-close-thin"></i>
                        </button>
                    </div>

                    <img src="https://www.habbocreate.com/images/furni/cat423.gif" />

                    <div className="frame-footer">

                        <i className="icon icon-small icon-profile">Textarea</i>

                        {this.props.isBuyable &&
                            <button className="btn btn-volter btn-flat btn-light">Buy one</button>
                        }
                    </div>
                </div>

                <div className="furniture-item-actions">
                    <button className="btn btn-volter btn-flat">Move</button>
                    <button className="btn btn-volter btn-flat">Rotate</button>
                    <button className="btn btn-volter btn-flat">Pick up</button>
                    <button className="btn btn-volter btn-flat">Use</button>
                </div>
            </React.Fragment>
        )
    }
}