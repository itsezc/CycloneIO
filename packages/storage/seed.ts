import { prisma, Language, CatalogPage } from './prisma'

// import Config

async function main() {

	// Ranks

	await prisma.createRank({
		order: 1,
		name: 'User'
	})

	await prisma.createRank({
		order: 2,
		name: 'Guardian'
	})

	await prisma.createRank({
		order: 3,
		name: 'Media'
	})

	await prisma.createRank({
		order: 4,
		name: 'Trial Moderator'
	})

	await prisma.createRank({
		order: 5,
		name: 'Moderator'
	})

	await prisma.createRank({
		order: 6,
		name: 'Senior Moderator'
	})

	await prisma.createRank({
		order: 7,
		name: 'Administrator'
	})

	await prisma.createRank({
		order: 8,
		name: 'Manager'
	})

	await prisma.createRank({
		order: 9,
		name: 'Developer'
	})

	await prisma.createRank({
		order: 10,
		name: 'Owner'
	})
	
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
		link: 'frontpage',
		name: 'Frontpage',
		icon: '1',
		order: 1,
		language: {
			connect: English
		}
	})

	await prisma.createCatalogPage({
		link: 'furniture',
		name: 'Furniture',
		icon: '3',
		enabled: true,
		order: 2,
		language: {
			connect: English
		}
	})

	const FurniturePage: CatalogPage = (({ id, link }) => ({ id, link }))(await prisma.catalogPage({ 
		link: 'furniture'
	}))

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Iced',
		link: 'iced',
		icon: '72',
		order: 1,
		banner: 'iced_1',
		teaser: 'iced_1',
		body: JSON.parse(`
			{
				"header": "The Iced range, squishy, soft and most definitely cool. Whatever your needs, this stylish range should  cover it!",
				"details": "Click on the item for more information."
			}
		`),
		language: {
			connect: English
		}
	})

	// console.log(FurniturePage)
}

main().catch(e => console.error(e))