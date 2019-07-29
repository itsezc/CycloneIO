import { prisma, Language, CatalogPage } from './prisma'

// import Config

async function main() {

	// #region Ranks

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

	// #endregion

	// #region Languages
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

	// #endregion

	// #region Navigator Tabs

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

	// #endregion

	// #region Catalog Featured

	await prisma.createCatalogFeatured({
		caption: 'Underwater House Bundle',
		slot: 1,
		image: 'https://images.habbo.com/c_images/catalogue/feature_cata_vert_coralking18_bun1.png'
	})

	await prisma.createCatalogFeatured({
		caption: 'Wardrobe Refresh',
		slot: 2,
		image: 'https://images.habbo.com/c_images/catalogue/feature_cata_hort_rainbow19_newclothes.png'
	})

	await prisma.createCatalogFeatured({
		caption: 'Pride Furni',
		slot: 3,
		image: 'https://images.habbo.com/c_images/catalogue/feature_cata_hort_rainbow19_newfurni.png'
	})

	await prisma.createCatalogFeatured({
		caption: 'Become a HC Member',
		slot: 4,
		image: 'https://images.habbo.com/c_images/catalogue/feature_cata_hort_HC_b.png'
	})

	// #endregion

	// #region Catalog Pages

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
		name: 'Credit Furni',
		link: 'creditfurni',
		icon: 'icon_146',
		order: 1,
		banner: 'iced_1',
		teaser: 'bank',
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Room Bundles',
		link: 'roombundles',
		icon: 'icon_206',
		order: 2,
		banner: 'iced_1',
		teaser: 'bank',
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Room Event',
		link: 'roomevents',
		icon: 'icon_55',
		order: 3,
		banner: 'iced_1',
		teaser: 'bank',
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Collectible RARE Inflatable',
		link: 'rare',
		icon: 'icon_42',
		order: 4,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Loot Crates',
		link: 'loot_crate',
		icon: 'icon_99',
		order: 6,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Wassa',
		link: 'wassa',
		icon: 'icon_103',
		order: 7,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'New Updated Furni',
		link: 'new_updated',
		icon: 'icon_79',
		order: 8,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'VIP Furni',
		link: 'vip',
		icon: 'icon_64',
		order: 9,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Tiki',
		link: 'tiki',
		icon: 'icon_59',
		order: 10,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Indoor Furni',
		link: 'indoor',
		icon: 'icon_63',
		order: 10,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Room Building',
		link: 'room_building',
		icon: 'icon_63',
		order: 11,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Outdoor Furni',
		link: 'outdoor',
		icon: 'icon_220',
		order: 11,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Furni by Line',
		link: 'byline',
		icon: 'icon_197',
		order: 11,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Habbo Club',
		link: 'club',
		icon: 'icon_172',
		order: 12,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Wired',
		link: 'wired',
		icon: 'icon_80',
		order: 13,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Bots',
		link: 'bots',
		icon: 'icon_65',
		order: 14,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Game Shop',
		link: 'game',
		icon: 'icon_202',
		order: 15,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Habbo Groups',
		link: 'groups',
		icon: 'icon_203',
		order: 15,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Music Shop',
		link: 'music',
		icon: '4',
		order: 16,
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

	await prisma.createCatalogPage({
		parent: {
			connect: FurniturePage
		},
		name: 'Marketplace',
		link: 'market',
		icon: 'icon_69',
		order: 17,
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

	// #endregion

	await prisma.createRoom({
		name: 'Test',
		map: JSON.parse('{ "room": [ "0000000", "0000000", "0000000", "0x00000", "0000000", "0000000", "0000000", "0000000", "0000000", "0000000", "0000000" ] }')
	})

	// console.log(FurniturePage)
}

main().catch(e => console.error(e))