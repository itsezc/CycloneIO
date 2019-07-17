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

        this.state = {
            roomData: {}
          };

        this.server = `${props.host}:${props.port}`

        this.Socket = SocketIO(this.server)
        this.Socket.on('connect', () => {
            console.log(`Connected to server on ${this.server}`)
            // this.Socket.emit('newConnection', 0)
        })

        this.Socket.emit('getRoom', 'cjy663lff01kq0732twjkyxk6')
        this.setSocketEvents();
    }

    private setSocketEvents(): void {
        this.Socket.on('setRoom', (data: any) => {
            this.setState({
                roomData: data
            })
        })
    }

    render() {
        return (
            <BrowserRouter>
                <Switch location={this.props.location}>
                    <Route exact path='/' component={Loading} />
                    <Route 
                        exact 
                        path='/inroom'
                        render={(props) => <Room {...props} roomData={this.state.roomData} />}
                        />
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
