import React from 'react';

export default class UserInfos extends React.PureComponent {

    render(){
        return (
            <div className="user-infos frame-100">
                
                <div className="frame-header">

                    <i className="icon icon-home"></i>
                    <h3>EZ-C2</h3>

                    <button className="btn btn-volter btn-action">
                        <i className="icon icon-close-thin"></i>
                    </button>
                </div>

                <div className="user-infos-content">

                    <div className="frame-card user-infos-avatar">
                        <img src="https://imager.habbo.industries/avatarimage.php?figure=fa-3276-1331.he-8394-1408.sh-725-1408.hd-600-1383.ch-691-1428.lg-710-110.ca-1815-1408.ha-3763-63.hr-834-54&action=std&gesture=std&direction=2&head_direction=2&size=n" />
                    </div>

                    <div className="user-infos-badges">
                        <img src="https://puhekupla.com/images/badges/ES86F.gif" />
                        <img src="https://puhekupla.com/images/badges/US003.gif" />
                        <img src="https://puhekupla.com/images/badges/ES01G.gif" />
                        <img src="https://puhekupla.com/images/badges/ACH_Login3.gif" />

                        <img src="https://www.habbo.com/habbo-imaging/badge/b06134t09010a4872f64ad6a5743cc3ba72069e03d3a.gif" 
                            className="user-infos-badges-guild" />
                    </div>
                </div>

                <hr />

                <textarea className="frame-card user-infos-motto is-own" spellcheck="false">
                    Smile, because it confuses people.
                </textarea>

                <div className="frame-footer">
                    <p className="user-infos-achievement">Achievement score <br/>1433</p>

                    <ul className="user-infos-relationships">
                        <li className="icon icon-relation-skull"><u>Fiona3..</u></li>
                        <li className="icon icon-relation-friend"><u>jahanvi21</u>and 21 others</li>
                    </ul>
                </div>
            </div>
        )
    }
}