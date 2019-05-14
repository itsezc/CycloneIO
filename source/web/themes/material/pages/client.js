import React, { Component } from 'react'
import ReactDOM from 'react-dom'

import '../client.css'

class Client extends Component {
    componentDidMount() {
        const script = document.createElement('script')

        script.src = 'http://localhost:8080/client.min.js'

        document.body.appendChild(script)
    }

    render() {
        return (
            <div>
            </div>
        )
    }
}

export default Client
