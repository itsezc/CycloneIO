import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Loading from './states/loading.jsx'
import Client from './states/client.jsx'

class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch location={this.props.location}>
                    <Route exact path='/' component={Loading} />
                    <Route exact path='/client' component={Client} />
                    <Route exact path='/hotel' component={Client} />
                </Switch>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))