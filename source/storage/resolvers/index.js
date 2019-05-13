import Bcrypt from 'bcryptjs'

module.exports = {
    resolvers: {
        Query: {
            bans: (parent, args, ctx, info) => ctx.db.bans({}, info),
            bots: (parent, args, ctx, info) => ctx.db.bots({}, info),
            rooms: (parent, args, ctx, info) => ctx.db.rooms({}, info),
            room: (parent, args, ctx, info) => ctx.db.rooms({ id: args.id }, info),
            users: (parent, args, ctx, info) => ctx.db.users({}, info),
            user: (parent, args, ctx) => ctx.db.users({ id: args.id }, info)
        },
        Mutation: {
            createUser: async (parent, { email, username, password }, ctx, info) => {
                const hashPassword = await Bcrypt.hash(password, 10)
                const user = await ctx.prisma.createUser({
                    email,
                    username,
                    password: hashedPassword
                })
                return user
            },

			createRoom: async (parent, args, ctx, info) => ctx.db.createRoom(args, info),
			upsertRoom: async (parent, args, ctx, info) => ctx.db.upsertRoom(args, info),
			updateRoom: async (parent, args, ctx, info) => ctx.db.updateRoom(args, info),
			deleteRoom: async (parent, args, ctx, info) => ctx.db.deleteRoom(args, info)
        },
    }
}