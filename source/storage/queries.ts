import gql from 'graphql-tag'

export const GetActiveRooms = gql`
	query GetActiveRooms {
		rooms(
			where: {
				currentUsers_gt: 0
			}
		) 
		{
			id
			name
			maxUsers
			currentUsers
		}
	}
`


export const GetNavigatorTabs = gql`
	query GetNavigatorTabs {
		navigatorTabs {
			order
			name
		}
	}
`
