import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import SocketIO from 'socket.io-client'

import Loading from './states/loading'
import Client from './states/client'
import Room from './states/room'


class App extends Component<any, any> {

    private server: string
    
    constructor(
        props: any,
        private Socket: SocketIOClient.Socket
    ) {
        super(props)

        this.server = `${props.host}:${props.port}`

        this.Socket = SocketIO(this.server)
        this.Socket.on('connect', () => {
            console.log(`Connected to server on ${this.server}`)
            // this.Socket.emit('newConnection', 0)
        })
    }

    render() {
        return (
            <BrowserRouter>
                <Switch location={this.props.location}>
                    <Route exact path='/' component={Loading} />
					<Route exact path='/inroom' component={Room} />
                    <Route exact path='/client' component={Client} />
                    <Route 
                        exact 
                        path='/hotel' 
                        render={(props) => <Client {...props} socket={this.Socket} />}
                    />
                </Switch>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(
    <App 
        host='localhost'
        port={8081}
    />, 
    document.getElementById('app')
)
