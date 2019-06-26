import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Login from './themes/2018/login'

class App extends Component
{
	render()
	{
		return (
			<BrowserRouter>
				{/* location={this.props.location} */}
                <Switch>
                    <Route exact path='/' component={Login} />
                </Switch>
            </BrowserRouter>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'))