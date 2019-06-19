import Bcrypt from 'bcryptjs'

const resolvers = {

	Query: {
		bans: (parent, args, ctx, info) => ctx.db.bans(args, info),
		bots: (parent, args, ctx, info) => ctx.db.bots(args, info),
		rooms: (parent, args, ctx, info) => ctx.db.rooms(args, info),
		room: (parent, args, ctx, info) => ctx.db.rooms({ id: args.id }, info),
		users: (parent, args, ctx, info) => ctx.db.users(args, info),
		user: (parent, args, ctx, info) => ctx.db.users({ id: args.id }, info),
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

		upsertUser: async (parent, args, ctx, info) => ctx.db.upsertUser(args, info),
		updateUser: async (parent, args, ctx, info) => ctx.db.updateUser(args, info),
		deleteUser: async (parent, args, ctx, info) => ctx.db.deleteUser(args, info),

		createRoom: async (parent, args, ctx, info) => ctx.db.createRoom(args, info),
		upsertRoom: async (parent, args, ctx, info) => ctx.db.upsertRoom(args, info),
		updateRoom: async (parent, args, ctx, info) => ctx.db.updateRoom(args, info),
		deleteRoom: async (parent, args, ctx, info) => ctx.db.deleteRoom(args, info)
	},
}

export { resolvers }