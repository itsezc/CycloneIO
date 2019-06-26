import React from 'react';
import FriendSlot from '../friendSlot';

export default class Friends extends React.Component {

    constructor(props){
        super(props);

        this.data = [
            'EZ-C', 'Myza', ''
        ];
    }

    render(){
        return (
            <div className='toolbar-friends-content'>
                {this.data.map((name, i) => {
                    return name == '' ? <FriendSlot key={i} type='unknown' /> : <FriendSlot key={i} username={name} />
                })}
            </div>
        )
    }
}