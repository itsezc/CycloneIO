import React from 'react';

import InformationsPanel from '../../modules/informations-panel';

export default class Hotel extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        return (
            <section className="hotel">
                <InformationsPanel />
            </section>
        )
    }
}