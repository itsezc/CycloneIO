import React from 'react';

export default class InformationsPanel extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="informations-panel">
                
                <div className="informations-offer">
                    <img src="/web-promo/smallpromo_bonusbag19_1.png" />

                    <div className="offer-content">
                        <h5>Bonus bag, 1 every 120 credits!</h5>

                        <div className="offer-content-infos">
                            <progress className="progressbar" value="10" max="100" data-label="Only 108/120 credits to go!"></progress>
                            <button className="btn btn-illumina">Get credits</button>
                        </div>
                    </div>
                </div>

                <div className="informations-news">

                    <div className="news-item">
                        <img src="/web-promo/spromo_Pastel_Bundle.png" />

                        <div className="news-item-content">
                            <h4>NEW Pastel Bundle!</h4>
                            <p>Cute stuffed toys and pastel rainbow funir: a fantastic combination, we think you'll agree!
                                Every single furni in this bundle is 100% exclusive and will never be found in our Catalogue for sale individually. What a bargain!
                            </p>

                            <button className="btn btn-illumina">See the bundle</button>
                        </div>
                    </div>

                    <div className="news-item-content">
                        <h4>Santorini Dock Bundle</h4>
                        <p>Nothing beats strating your holiday by pulling into Santorini(s beatufiul dock.</p>

                        <button className="btn btn-illumina">See the bundle</button>
                    </div>

                    <div className="news-item">
                        <img src="/web-promo/spromo_may19_commask.png" />
                        
                        <div className="news-item-content">
                            <h4>RARE Theatrical Masks!</h4>
                            <p>There's a mask for every occasion. Well not EVERY occasion. However we(ve got a tragic mask and a comedic mask for sale. Both rare,
                                both never to be sold again!
                            </p>

                            <button className="btn btn-illumina">See the rare</button>
                        </div>
                    </div>

                    <div className="news-item-content">
                        <h4>NEW Ancient Greek Furni!</h4>
                        <p>Go and check out the mini furni lne we released for our Ancien Greek revisitation event!</p>

                        <button className="btn btn-illumina">See the furni</button>
                    </div>
                </div>
            </div>
        )
    }
}