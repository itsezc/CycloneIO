import React from 'react';

import Dialog from '../../components/dialog';
import Scrollbar from '../../components/scrollbar';

export default class Inventory extends React.PureComponent {

    render(){
        return (
            <Dialog className="inventory" title="Inventory" defaultPos={[1000, 200]}>
                
                <div className="dialog-tabs">

                    <ul className="dialog-tabs-actions">
                        <li className="is-active">Furniture</li>
                        <li>Rentables</li>
                        <li>Pets</li>
                        <li>Achieved badges</li>
                        <li>Bots</li>
                    </ul>
                </div>

                <div className="dialog-content">
                    
                    <div className="dialog-filter">

                        <input className="input" type="text" />

                        <select className="dropdown">
                            <option>Any type</option>
                            <option>Floor items</option>
                            <option>Wall items</option>
                        </select>
                    </div>

                    <div className="inventory-content">

                        <Scrollbar>
                            <ul className="items-list">
                                <li>
                                    <img src="https://puhekupla.com/images/furni/small_petfood26.png" />
                                    <span>2</span>
                                </li>
                                <li className="is-active"><img src="https://puhekupla.com/images/furni/small_bar_basic.png" /></li>
                                <li><img src="https://puhekupla.com/images/furni/small_market_c19_signboard.png" /></li>
                                <li><img src="https://puhekupla.com/images/furni/small_suncity_c19_perfumeshop.png" /></li>
                                <li><img src="https://puhekupla.com/images/furni/small_suncity_c19_gazebo.png" /></li>
                                <li><img src="https://puhekupla.com/images/furni/small_xmas08_hole.png" /></li>
                                <li><img src="https://puhekupla.com/images/furni/small_cmp_fish_b.png" /></li>
                            </ul>
                        </Scrollbar>
                        
                        <div className="inventory-content-render">

                        </div>
                    </div>
                </div>
            </Dialog>
        )
    }
}