import React from 'react';

export default class Tab extends React.PureComponent {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <>
                {this.props.children}
            </>
        )
    }
}