import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Hotel from './states/hotel'
import Room from './states/client'

class Mobile extends Component<any, any> {

	public render() {
		return (
            <BrowserRouter>
                <Switch location={this.props.location}>
                    <Route exact path='/' component={Hotel} />
                    <Route exact path='/inroom' component={Room} />
                </Switch>
            </BrowserRouter>
        )
	}
}

ReactDOM.render(<Mobile />, document.getElementById('app'))