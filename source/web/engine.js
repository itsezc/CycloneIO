import Index from './themes/material/pages/index'
import Logout from './themes/material/pages/logout'
import Register from './themes/material/pages/register'
import Client from './themes/material/pages/client'

class App extends React.Component {
    render() {
        return (
            <ReactRouterDOM.BrowserRouter>
                <ReactRouterDOM.Route exact path="/" component={Index} />
                <ReactRouterDOM.Route
                    exact
                    path="/register"
                    component={Register}
                />
                <ReactRouterDOM.Route exact path="/logout" component={Logout} />
                <ReactRouterDOM.Route exact path="/client" component={Client} />
            </ReactRouterDOM.BrowserRouter>
        )
    }
}

ReactDOM.render(<App name="Chiru" />, document.getElementById('app'))
