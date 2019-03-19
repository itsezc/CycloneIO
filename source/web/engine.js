import React, { Component } from 'react'
import ReactDOM from 'react-dom'

class HelloMessage extends Component {
  render() {
    return <div>Hello {this.props.name}</div>;
  }
}

ReactDOM.render(
	<HelloMessage name='Chiru' />,
	document.getElementById('app')
)
