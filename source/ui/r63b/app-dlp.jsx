import React, {Component} from 'react';
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Actions from './components/actions.jsx'
import Toolbar from './components/toolbar.jsx'
import Wallet from './components/wallet.jsx'

import Alert from './components/dialogs/alert.jsx'
import Catalog from './components/dialogs/catalog.jsx'
import Moderation from './components/dialogs/moderation.jsx'

import Navigator from './components/dialogs/navigator.jsx'

import Chat from './components/chat/bubble.jsx'

import Loading from './states/loading.jsx'
import Hotel from './states/hotel.jsx'

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