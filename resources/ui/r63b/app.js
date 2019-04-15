import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Loading from './states/loading'
import Client from './states/client'

//import Alert from './components/alert'

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
