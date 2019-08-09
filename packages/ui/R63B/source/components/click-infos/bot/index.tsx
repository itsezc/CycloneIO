import React from 'react';

export default class BotInfos extends React.PureComponent {

    render(){
        return (
            <div className="bot-infos frame-100">

                <div className="frame-header">
                    <h3>CaptainAudemars</h3>

                    <button className="btn btn-volter btn-action">
                        <i className="icon icon-close-thin"></i>
                    </button>
                </div>

                <div className="bot-infos-content">

                    <div className="frame-card bot-infos-avatar">
                        <img src="https://www.habbo.com/habbo-imaging/avatar/hr-3163-61.hd-180-1370.ch-3321-110.lg-3526-110-1408.ha-3709.he-3772-92.fa-3276-91.ca-3437-92.cc-3744-1408-92%2Cs-0.g-1.d-2.h-2.a-0%2C7e0db12b6f401da015bf9463f11dca83.png" />
                    </div>

                    <img src="/badges/bot.png" className="bot-infos-badge" />
                </div>

                <p>Tells who visited the room while you've been away</p>

                <div className="frame-footer">
                    <p>Owners: audemars</p>
                </div>
            </div>
        )
    }
}