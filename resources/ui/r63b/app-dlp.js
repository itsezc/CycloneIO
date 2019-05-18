import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Actions from './components/actions'
import Toolbar from './components/toolbar'
import Wallet from './components/wallet'

import Alert from './components/dialogs/alert'
import Catalog from './components/dialogs/catalog'
import Moderation from './components/dialogs/moderation'

import Navigator from './components/dialogs/navigator'

import Chat from './components/chat/bubble.jsx'

import Loading from './states/loading'
import Hotel from './states/hotel'

export default class App extends Component {

    constructor(props){
        super(props);

        this.state = {
            loaded: true
        }
    }

    componentWillMount(){
        /*
        this.database = new ApolloClient({
			uri: 'http://localhost:8081/graphql'
		})*/
    }

    finishLoading(){
        this.setState({
            loaded: true
        })
    }

    render(){

        if(!this.state.loaded) return <Loading onFinishLoading={this.finishLoading.bind(this)} />
        else return (

            <BrowserRouter>
                
                <main className="client">

                    <Switch location={this.props.location}>
                        <Route exact path="/" component={Hotel} />
                        <Route exact path='/room' component={null} />
                    </Switch>

                    <Actions />
                    <Wallet />

                    <Moderation />
				    <Catalog /> 
                    <Alert
                        title='Message from Habbay Hotel'
                        message='This is a text message, except that it is a very long text message even so that it takes a few lines, which is pretty surprising because its our very first element, so Enjoy!'
                        author='EZ-C'
                    />
                    <Chat
                        name='EZ-C'
                        avatar='https://cdn.discordapp.com/attachments/557261127847772161/577965083905359892/Screenshot_from_2019-05-14_23-02-49.png'
                        type='shout'
                        style={2}
                        message='This is an example message'
                    />

                    <Toolbar />
                </main>
            </BrowserRouter>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('app'))