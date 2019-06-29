import React from 'react';

export default class FurnitureInfos extends React.PureComponent {

    render(){
        return (
            <React.Fragment>

                <div className="furniture-item ui-100">
                    <div className="ui-100-header">
                        <h3>Pure Minibar</h3>

                        <button className="btn btn-volter btn-close">
                            <i className="icon icon-close-thin"></i>
                        </button>
                    </div>

                    <img src="/minibar.png" />

                    <div className="ui-100-footer">
                        <i className="icon icon-small icon-profile">Textarea</i>
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