import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

class App extends Component {
	render() {
		return (
			<div>
				This is the CMS
			</div>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'))