import React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom'

import './index.scss';

import Interface from './components/interface';

import Hotel from './states/hotel';
import Loading from './states/loading';
import Room from './states/room';

class Client extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            isLoaded: true
        }
    }

    onFinishLoading(){
        this.setState({
            isLoaded: true
        });
    }

    render(){
        if (!this.state.isLoaded) return <Loading onFinishLoading={this.onFinishLoading.bind(this)} />
        else return (
            <BrowserRouter>
                <Interface>
                    <Switch location={this.props.location}>
                        <Route exact path='/room/:id' component={Room} />
                        <Route exact path='*' component={Hotel} />
                    </Switch>
                </Interface>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(
    <Client />, document.getElementById('app')
);