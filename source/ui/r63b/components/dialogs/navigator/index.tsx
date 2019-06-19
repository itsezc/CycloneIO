import React, { Component } from 'react'
import { Query } from 'react-apollo'
import { GetActiveRooms, GetActiveRooms_rooms } from '../../../../../storage/__generated__/types'
import { GetActiveRooms as QUERY } from '../../../../../storage/queries'

export default class Navigator extends Component 
{

	private query: Query 

	constructor(props: any)
	{
		super(props)
	}

	render()
	{
		return(
			<div>
				{/* variables={{ limit: 2 }} */}
				<Query<GetActiveRooms, GetActiveRooms_rooms> query={QUERY} notifyOnNetworkStatusChange>
					{({ loading, error, data }) => {
						if (loading) return 'Loading..'
						if (error) return 'Error..'

						return (
							<div>
								{
									data.rooms.map(room => (
										<p key={room.id}>{room.id} : {room.name} : Current({room.currentUsers}) - {/* JSON.stringify(room.map) */}</p>
									))
								}
							</div>
						)
					}}
				</Query>
			</div>
		)	
	}
}



// import React, { Component } from 'react'
// import { Query } from 'react-apollo'
// import { gql } from 'apollo-boost'

// //	https://www.apollographql.com/docs/react/features/pagination


// // export default class Test extends Component {
// // 	constructor(props) {
// // 		super(props)

// // 		this.database = new ApolloClient({
// // 			uri: 'http://localhost:8081/graphql'
// // 		})
// 		// this.query = 
// 		// gql`
// 		// {
// 		// 	rooms {
// 		// 		id
// 		// 		name
// 		// 		map
// 		// 	}
// 		// }
// 		// `
// // 	}

// // 	render() {
// // 		return(
// // 			<p>Test This is a long message jason</p>
// // 		)
// // 	}
// // }

// let query = 
// gql`
// # {
// # 	rooms {
// # 		id
// # 		name
// # 		map
// # 	}
// # }
// query Rooms($limit: Int) {
// 	rooms(first: $limit) {
// 		id
// 		name
// 		map
// 	}
// }
// `

// const Navigator = () => (
// 	<Query query={query} variables={{ limit: 2 }}>
// 		{({ loading, error, data }) => {
// 			if (loading) return 'Loading..'
// 			if (error) return 'Error..'

// 			return (
// 				<div>
// 					{data.rooms.map(room => (
// 						<p key={room.id}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {room.id} : {room.name} : {JSON.stringify(room.map)}</p>
// 					))}
// 					</div>
// 			)
// 		}}
// 	</Query>
// )

// export default Navigator


// //	https://www.apollographql.com/docs/react/features/pagination


// // export default class Test extends Component {
// // 	constructor(props) {
// // 		super(props)

// // 		this.database = new ApolloClient({
// // 			uri: 'http://localhost:8081/graphql'
// // 		})
// 		// this.query = 
// 		// gql`
// 		// {
// 		// 	rooms {
// 		// 		id
// 		// 		name
// 		// 		map
// 		// 	}
// 		// }
// 		// `
// // 	}

// // 	render() {
// // 		return(
// // 			<p>Test This is a long message jason</p>
// // 		)
// // 	}
// // }

// let query = 
// gql`
// # {
// # 	rooms {
// # 		id
// # 		name
// # 		map
// # 	}
// # }
// query Rooms($limit: Int) {
// 	rooms(first: $limit) {
// 		id
// 		name
// 		map
// 	}
// }
// `

// const Navigator = () => (
// 	<Query query={query} variables={{ limit: 2 }}>
		// {({ loading, error, data}) => {
		// 	if (loading: any) return 'Loading..'
		// 	if (error) return 'Error..'

		// 	return (
		// 		<div>
		// 			{data.rooms.map(room: any => (
		// 				<p key={room.id}>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; {room.id} : {room.name} : {JSON.stringify(room.map)}</p>
		// 			))}
		// 			</div>
		// 	)
		// }}
// 	</Query>
// )

// export default Navigator