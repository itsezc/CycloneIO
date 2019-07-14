import Hapi from '@hapi/hapi'
import { ApolloServer, makeExecutableSchema } from 'apollo-server-hapi'
import { prisma } from '../../../../storage/prisma'
import { typeDefs } from '../../../../storage/prisma/prisma-schema'
import { resolvers } from '../../../../storage/resolvers/index'
import CycloneConfig from '../../../../common/types/config'

 export const createAPIServer = async (config: CycloneConfig): Promise<Hapi.Server> => {
    const api = new Hapi.Server(
        {
            //This should be in the config
            port: 8087
        }
    )

    const schema = makeExecutableSchema(
        {
            typeDefs,
            resolvers,
            resolverValidationOptions: {
                requireResolversForResolveType: false
            }
        }
    )

    const apolloServer = new ApolloServer(
        {
            schema,
            context: {
                db: prisma
            }
        }
    )

    await apolloServer.applyMiddleware({
        app: api
    })

    await apolloServer.installSubscriptionHandlers(api.listener)

    return api
 }

 export default createAPIServer