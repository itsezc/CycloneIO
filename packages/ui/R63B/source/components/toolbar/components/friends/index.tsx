import React from 'react';

import FriendSlot from '../friendSlot';

type Props = {
    friends: string[]
}

export default class Friends extends React.PureComponent<Props, any> {
    
    private readonly findingNewFriendsMax: number = 3;

    constructor(props: Props){
        super(props);

        const friendsPerPage = 6;

        var findingNewFriends = (this.findingNewFriendsMax - this.props.friends.length);
        findingNewFriends = findingNewFriends <= 0 ? 1 : findingNewFriends;

        if(findingNewFriends == 1 && props.friends.length % friendsPerPage == 0) findingNewFriends = 0;

        this.state = {
            page: 0,
            friendsPerPage,
            findingNewFriends,

            slotIndex: null,
        }
    }

    getMaxPage = () => {
        return Math.ceil((this.props.friends.length) / this.state.friendsPerPage);
    }

    createFindingNewFriends = () => {
        return Array.from({length: this.state.findingNewFriends}, (_, i) => 
            <FriendSlot key={i} type='unknown' isOpen={this.state.slotIndex == i} toggleSlot={this.toggleSlot.bind(this, i)} />);
    }

    createFriends = () => {
        return Array.from(this.props.friends, (d, i) => 
            <FriendSlot key={i} username={d} isOpen={this.state.slotIndex == i} toggleSlot={this.toggleSlot.bind(this, i)} />);
    }

    createFriendsPagination = () => {

        const { page, friendsPerPage } = this.state;
        const datas: JSX.Element[] = this.createFriends().concat(this.createFindingNewFriends());

        var dataPage = datas.slice(page * friendsPerPage, (page + 1) * friendsPerPage);
        if(dataPage.length == 0) return null;
        
        if(this.props.friends.length > friendsPerPage && dataPage.length < friendsPerPage){
            
            var start = (page * friendsPerPage) - (friendsPerPage - dataPage.length);
            dataPage = datas.slice(start, start + friendsPerPage);
        }
  
        return dataPage;
    }

    previous = () => {

        if(this.state.page == 0) return;
        this.setState({ page: this.state.page - 1 }, () => this.setState({ slotIndex: null }));
    }

    next = () => {
        
        if(this.state.page + 1 == this.getMaxPage()) return;
        this.setState({ page: this.state.page + 1 }, () => this.setState({ slotIndex: null }));
    }

    toggleSlot = (slotIndex: number) => {

        if(this.state.slotIndex == slotIndex) this.setState({ slotIndex: null });
        else this.setState({ slotIndex });
    }

    render(){
        return (

            <div className="toolbar-friends-wrapper">

                <button className="btn btn-history btn-history-previous" disabled={this.state.page == 0} onClick={this.previous}>
                    <i className="icon icon-carret-left"></i>
                </button>

                <div className='toolbar-friends-content'>
                    {this.createFriendsPagination()}
                </div>

                <button className="btn btn-history btn-history-next" disabled={this.state.page + 1 == this.getMaxPage()} onClick={this.next}>
                    <i className="icon icon-carret-right"></i>
                </button>
            </div>
        )
    }
}