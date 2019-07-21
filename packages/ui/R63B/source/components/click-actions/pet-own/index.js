import React from 'react';
import PetActions from '../pet';

import ClickActions from '..';

export default class PetOwnActions extends PetActions {

    render(){
        return (
            <ClickActions className="pet-actions" isOwn={true} {...this.props}>

                {this.props.isRidable &&
                    <React.Fragment>
                        <li><span>Ride</span></li>
                        <li>
                            <i className="icon icon-checkbox-check"></i>
                            <span>Anyone can ride</span>
                        </li>
                    </React.Fragment>
                }

                <li><span>Scratch (3)</span></li>
                <li><span>Train</span></li>
                <li><span>Pick up</span></li>

                {this.props.canBreed || true &&
                    <li><span>Breed</span></li>
                }

                {this.props.hasSaddle &&
                    <li><span>Remove Saddle</span></li>
                }
            </ClickActions>
        )
    }
}