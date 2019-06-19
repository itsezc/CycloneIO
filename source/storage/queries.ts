import gql from 'graphql-tag'

export const GetActiveRooms = gql`
	query GetActiveRooms {
		rooms(
			where: {
				currentUsers_gt: 0
			}
		) {
			id
			name
			maxUsers
			currentUsers
		}
	}`