import ApolloClient from 'apollo-boost'

const API: ApolloClient<Object> = new ApolloClient({
	uri: 'http://localhost:8087/graphql'
})

export {
	API
}