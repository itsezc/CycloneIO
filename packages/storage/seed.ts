import { prisma, Language } from './prisma'

// import Config

async function main() {
	
	// Add languages
	await prisma.createLanguage({
		name: 'English',
		native: 'English',
		code: 'en'
	})

	await prisma.createLanguage({
		name: 'Italian',
		native: 'Italiano',
		code: 'it',
		enabled: false
	})

	await prisma.createLanguage({
		name: 'Spanish',
		native: 'Español',
		code: 'es'
	})

	await prisma.createLanguage({
		name: 'French',
		native: 'Français',
		code: 'fr'
	})

	const English: Language = (({ id, code }) => ({ id, code }))(await prisma.language({ code: 'en' }))
	const Italian: Language = (({ id, code }) => ({ id, code }))(await prisma.language({ code: 'it' }))
	const Spanish: Language = (({ id, code }) => ({ id, code }))(await prisma.language({ code: 'es' }))
	const French: Language = (({ id, code }) => ({ id, code }))(await prisma.language({ code: 'fr' }))

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

	await prisma.createCatalogPage({
		layout: "FRONTPAGE",
		name: 'Frontpage',
		icon: '1',
		enabled: true,
		rank: 1,
		club: false,
		vip: false,
		order: 1,
		language: {
			connect: English
		}
	})
}

main().catch(e => console.error(e))