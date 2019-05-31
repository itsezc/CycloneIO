import Config from '../../config.json'

import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'

import Index from './themes/material/pages/index.jsx'
import Client from './themes/material/pages/client.jsx'

import ApolloClient, { gql } from 'apollo-boost' 
import { ApolloProvider, Query } from 'react-apollo'

// PassportJS Auths => State in ApolloClient => Output

class App extends Component {
	constructor(props) {
		super(props)

		this.state = {}
		this.database = new ApolloClient({
			uri: 'http://localhost:8081/graphql'
		})
	}

    render() {
        return (
            <BrowserRouter>
                <Route exact path='/' component={Index} />
				<Route exact path='/client' component={Client} />
            </BrowserRouter>
        )
    }
}

ReactDOM.render(
	<App name='Chiru' />, 
	document.getElementById('app')
)
