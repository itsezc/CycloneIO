import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

// import Loading from './states/loading'
// import Hotel from './states/'
import Room from './states/room'

class App extends Component<any, any> {

    render() {
        return (
            <BrowserRouter>
                <Switch location={this.props.location}>
                    <Route exact path='/' component={Room} />
					<Route exact path='/inroom' component={Room} />
                    {/* <Route exact path='/client' component={Client} /> */}
                    {/* <Route exact path='/hotel' component={Client} /> */}
                </Switch>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))
