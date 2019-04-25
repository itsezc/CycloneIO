import Bcrypt from 'bcryptjs'

module.exports = {
	resolvers: {
		Query: {
			users: (parents, args, ctx, info) => ctx.db.users({}, info)
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