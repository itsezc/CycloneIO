import React, {PureComponent} from 'react';

export default class FriendSlot extends PureComponent {

    constructor(props){
        super(props);
    }

    render() {

        if(this.props.type === 'unknown'){
            return (
                <div className={"toolbar-friends-slot is-unknown" + (this.props.isOpen ? " is-open" : '')} onClick={this.props.toggleSlot}>
                    <div className='toolbar-friends-slot-header'>
                        <img src="/r63b/toolbar/icons/friend_head.png" />
                        Find new <br /> friends
                    </div>

                    <div className="toolbar-friends-slot-content">
                        <p>Looking for new friend ? Search for Habbos.</p>
                        <button className='btn btn-r63b btn-bold'>Go get friends</button>
                    </div>
                </div>
            ); 
        } else {
            return (
                <div className={"toolbar-friends-slot" + (this.props.isOpen ? " is-open" : '')} onClick={this.props.toggleSlot}>
                    <div className='toolbar-friends-slot-header'>
                        <img src={`https://www.habbo.com/habbo-imaging/avatarimage?hb=image&user=${this.props.username}&headonly=1&direction=2&head_direction=2&action=&gesture=&size=m`} />
                        {this.props.username}
                    </div>

                    <div className='toolbar-friends-slot-content'>
                        <span className='icon icon-sendmessage' />
                        <span className='icon icon-joinroom' />
                        <span className='icon icon-profile' />
                    </div>
                </div>
            );
        }
    }
}