import Bcrypt from 'bcryptjs'

module.exports = {
	resolvers: {
		Query: {
			bans: (parent, args, ctx, info) => ctx.db.bans({}, info),
			bots: (parent, args, ctx, info) => ctx.db.bots({}, info),
			rooms: (parent, args, ctx, info) => ctx.db.rooms({}, info),
			users: (parent, args, ctx, info) => ctx.db.users({}, info),
			user: (parent, args, ctx) => ctx.db.users({ id: args.id }, info),
 		},
		Mutation: {
			createUser: async(parent, { email, username, password }, ctx, info) => {
				const hashPassword = await Bcrypt.hash(password, 10)
				const user = await ctx.prisma.createUser({
					email,
					username,
					password: hashedPassword
				})
				return user
			}
		}
	}
}