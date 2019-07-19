import React from 'react';
import FriendSlot from '../friendSlot';

export default class Friends extends React.PureComponent {

    constructor(props) {
        super(props);

        const friendsPerPage = this.computeFriendsPerPage();
        const findingNewFriendsMax = 3;

        let findingNewFriendsCount = (findingNewFriendsMax - props.friends.length);
        findingNewFriendsCount = (findingNewFriendsCount <= 0) ? 1 : findingNewFriendsCount;

        if(findingNewFriendsCount === 1 && props.friends.left % friendsPerPage === 0)
            findingNewFriendsCount = 0;

        this.state = {
            currentPage : 0,
            friendsPerPage,
            findingNewFriendsCount,

            slotIndex: undefined
        }
    }

    componentWillMount() {
        window.addEventListener('resize', this.resizeComponent);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resizeComponent);
    }

    computeFriendsPerPage = () => {
        return Math.floor(( window.innerWidth * 7) / 2500 );
    }

    resizeComponent = (e) => {
        this.setState({ friendsPerPage: this.computeFriendsPerPage() })
    }

    hasMoreThanOnePage = () => {
        return this.getLastPage() !== 1;
    }

    getLastPage = () => {
        return Math.ceil(this.props.friends.length / this.state.friendsPerPage);
    }

    previous = () => {
        this.setState({ currentPage: this.state.currentPage - 1, 
            slotIndex: undefined });
    }

    next = () => {
        this.setState({ currentPage: this.state.currentPage + 1, 
            slotIndex: undefined });
    }

    toggleSlot = (newSlotIndex) => {
        this.setState({ slotIndex: (this.state.slotIndex === newSlotIndex) ? null : newSlotIndex });
    }

    renderFriendsSlots = () => {

        // Finding New Friends slots generate from "findingNewFriendsCount"
        const _generateFindingNewFriendSlots = Array.from({length: this.state.findingNewFriendsCount}, (_, i) =>
            <FriendSlot key={i} type='unknown' isOpen={this.state.slotIndex === i} toggleSlot={this.toggleSlot.bind(this, i)} />);

        // Friends slots generate from "props.children"
        const _generateFriendsSlots = Array.from(this.props.friends, (d, i) =>
            <FriendSlot key={i} username={d} isOpen={this.state.slotIndex === i} toggleSlot={this.toggleSlot.bind(this, i)} />);

            
        const { currentPage, friendsPerPage } = this.state;
        const datas = _generateFriendsSlots.concat(_generateFindingNewFriendSlots);

        let dataPage =  datas.slice(currentPage * friendsPerPage, (currentPage + 1) * friendsPerPage);
        if(dataPage.length === 0) return null;

        if(this.props.friends.length >= friendsPerPage && dataPage.length < friendsPerPage){

            let startWithDifference = (currentPage * friendsPerPage) - (friendsPerPage - dataPage.length);
            dataPage = datas.slice(startWithDifference, startWithDifference + friendsPerPage);
        }

        return dataPage;
    }

    render(){
        return (

            <div className="toolbar-friends-wrapper">

                <button className="btn btn-history btn-history-previous" disabled={this.state.currentPage === 0} onClick={this.previous}>
                    <i className="icon icon-carret-left"></i>
                </button>

                <div className='toolbar-friends-content'>
                    {this.renderFriendsSlots()}
                </div>

                <button className="btn btn-history btn-history-next" disabled={this.state.currentPage + 1 === this.getLastPage()} onClick={this.next}>
                    <i className="icon icon-carret-right"></i>
                </button>
            </div>
        )
    }
}