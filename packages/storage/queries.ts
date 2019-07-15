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
		navigatorTabs(orderBy: order_ASC) {
			id
			name
		}
	}
`

export const GetNavigatorCategories = gql`
	query GetNavigatorCategories {
		navigatorCategories(orderBy: order_ASC) {
			id
			name
			parent {
				id
			}
		}
	}
`

export const GetCatalogFeatureds = gql`
	query GetCatalogFeatured {
		catalogFeatureds(orderBy: slot_ASC) {
			caption
			image
			link {
				id
			}
		}
	}
`

export const GetCatalogPages = gql`

	query GetCatalogPages {
		catalogPages {
			id
			link
			parent {
				id
			}
			layout
			order
			name
			language {
				id
			}
			description
			icon
			banner
			teaser
			visible
			enabled
			rank
			club
			vip
			body
			product
		}
	}
`