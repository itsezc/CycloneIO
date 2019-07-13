import { prisma } from './prisma'

async function main() {

	await prisma.createNavigatorTab({
		order: 1,
		name: 'Public'
	})

	await prisma.createNavigatorTab({
		order: 2,
		name: 'All Rooms'
	})

	await prisma.createNavigatorTab({
		order: 3,
		name: 'Events'
	})

	await prisma.createNavigatorTab({
		order: 4,
		name: 'My World'
	})
}

main().catch(e => console.error(e))