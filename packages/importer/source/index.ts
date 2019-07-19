import HTTP from 'https'
import IO from 'fs'

const HabboHotels = [
	'com.tr',
	'com',
	'nl',
	'it',
	'com.br',
	'de',
	'fi',
	'es',
	'fr'
]

HabboHotels.forEach(hotel => {
	const ExternalTexts = IO.createWriteStream(`./external_flash_texts_${hotel}.txt`)
	const request = HTTP.get(`https://www.habbo.${hotel}/gamedata/external_flash_texts/0`, {
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows; U; Windows NT 5.1; en-US) AppleWebKit/525.19 (KHTML, like Gecko) Chrome/1.0.154.53 Safari/525.19'
		}
	}, response => {
		response.pipe(ExternalTexts)
		console.log('Done!')
	})
})

