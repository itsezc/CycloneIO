import React from 'react';
import ClickActions from '../';

export default class PetActions extends React.PureComponent {

    render(){
        return (
            <ClickActions className="pet-actions" {...this.props}>
                {this.props.isRidable &&
                    <li><span>Ride</span></li>
                }

                <li><span>Scratch (3)</span></li>
            </ClickActions>
        )
    }
}