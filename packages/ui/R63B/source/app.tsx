import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { Provider } from 'react-redux'
import { Store } from './store'

import ApolloClient from 'apollo-boost'
import { ApolloProvider } from 'react-apollo'

import SocketIO from 'socket.io-client'

import Loading from './states/loading'
import Client from './states/client'
import Room from './states/room'
import Games from './states/gamecenter'

import './app.styl'

class App extends Component<any, any> {

    private server: string
    
    public API: ApolloClient<any>
    
    constructor(props: any, private Socket: SocketIOClient.Socket) {
        super(props)

        this.state = {
            roomData: {}
        };

        this.API = new ApolloClient({
			uri: 'http://localhost:8087/graphql'
		})

        this.server = `${props.host}:${props.port}`

        this.Socket = SocketIO(this.server)
        this.Socket.on('connect', () => {
            console.log(`Connected to server on ${this.server}`)
        })

        this.Socket.emit('joinRoom', 'cjy84p6y600lr07320ly34wwf')
    }

    render() {
        return (
            <ApolloProvider 
                client={this.API}
            >
                <Provider 
                    store={Store}
                >
                    <BrowserRouter>
                        <Switch location={this.props.location}>
                            <Route exact path='/' component={Loading} />
                            <Route 
                                exact 
                                path='/inroom'
                                render={(props) => <Room {...props} socket={this.Socket} />}
                                />
                            <Route exact path='/client' component={Client} />
                            <Route exact path='/gamecenter' component={Games} />
                            <Route 
                                exact 
                                path='/hotel' 
                                render={(props) => <Client {...props} socket={this.Socket} />}
                            />
                        </Switch>
                    </BrowserRouter>
                </Provider>
            </ApolloProvider>
        )
    }
}

ReactDOM.render(
    
        <App 
            host='localhost'
            port={8081}
        />
    , document.getElementById('app')
)
