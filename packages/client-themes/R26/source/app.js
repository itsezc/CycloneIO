import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Client from './states/client/client.jsx'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch location={this.props.location}>
                    <Route exact path='/' component={Client} />
					<Route exact path='/hotel' component={Client} />
					<Route exact path='/client' component={Client} />
                </Switch>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
