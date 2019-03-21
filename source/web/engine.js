import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import ReactDOM from 'react-dom'

import Header from './themes/material/layouts/header.js'

import Home from './themes/material/pages/home'
import Logout from './themes/material/pages/logout'
import Register from './themes/material/pages/register'

class App extends Component {
  render() {
    return (
		<Router>
			<div>
				<Route exact path='/' component={Home} />
				<Route  path='/account/logout' component={Logout} />
				<Route exact path='/register' component={Register} />
				Hello {this.props.name}
			</div>
		</Router>
	)
  }
}

ReactDOM.render(
	<App name='Chiru' />,
	document.getElementById('app')
)
