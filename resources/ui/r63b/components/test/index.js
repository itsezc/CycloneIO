import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { gql } from 'apollo-boost'

// export default class Test extends Component {
// 	constructor(props) {
// 		super(props)

// 		this.database = new ApolloClient({
// 			uri: 'http://localhost:8081/graphql'
// 		})
		// this.query = 
		// gql`
		// {
		// 	rooms {
		// 		id
		// 		name
		// 		map
		// 	}
		// }
		// `
// 	}

// 	render() {
// 		return(
// 			<p>Test This is a long message jason</p>
// 		)
// 	}
// }

let query = 
gql`
{
	rooms {
		id
		name
		map
	}
}
		`

const Test = () => (
	<Query query={query}>
		{({ loading, error, data }) => {
			if (loading) return 'Loading..'
			if (error) return 'Error..'

			return (
				<div>
					{data.rooms.map(room => (
						<p key={room.id}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {room.id} : {room.name} : {room.map}</p>
					))}
				</div>
			)
		}}
	</Query>
)

export default Test