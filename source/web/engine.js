import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Route, Link } from 'react-router-dom'

import Index from './themes/2018/pages/index'


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
                <Route exact path="/" component={Index} />
            </BrowserRouter>
        )
    }
}

ReactDOM.render(
	<App name="Chiru" />, 
	document.getElementById('app')
)
