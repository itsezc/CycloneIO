import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

class Mobile extends Component {
	render() {
		return (
            <BrowserRouter>
                <Switch location={this.props.location}>
                    <Route exact path='/' component={Hotel} />
                </Switch>
            </BrowserRouter>
        )
	}
}

ReactDOM.render(<Mobile />, document.getElementById('app'))