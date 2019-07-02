import Avatar, { Direction, FigurePart } from './index'

export const LOCAL_RESOURCES = '//localhost:8082/web-gallery/avatar/'

export default class Imager {
	ready: boolean = false
	offsets: any = {}
	chunks: any = {}
	figuremap: any = {}
	figuredata: any = {}
	partsets: any = {}
	draworder: any = {}
	animation: any = {}
	
	initialize(): Promise<void> {
		const p = this.loadFiles()

		return Promise.all(p).then(() => {
			this.ready = true
		})
	}

	loadFiles(): Promise<void>[] {
		return [
			this.fetchJsonAsync(LOCAL_RESOURCES + 'map.json')
			.then(data => {
				this.figuremap = data
			}),

			this.fetchJsonAsync(LOCAL_RESOURCES + 'figuredata.json')
			.then(data => {
				this.figuredata = data
			}),

			this.fetchJsonAsync(LOCAL_RESOURCES + 'partsets.json')
			.then(data => {
				this.partsets = data
			}),

			this.fetchJsonAsync(LOCAL_RESOURCES + 'draworder.json')
			.then(data => {
				this.draworder = data
			}),

			this.fetchJsonAsync(LOCAL_RESOURCES + 'animation.json')
			.then(data => {
				this.animation = data
			})
		]
	}
	
	fetchJsonAsync(URL: string): Promise<object> {
		return new Promise((resolve, reject) => {
			
			const options: RequestInit = {
				method: 'GET',
				mode: 'cors',
				cache: 'default'
			}

			fetch(URL, options)
				.then(response => response.json())
				.then(data => resolve(data))
				.catch(err => reject(err))
		})
	}

	fetchOffsetAsync(uniqueName: string): Promise<void> {
		return this.fetchJsonAsync(LOCAL_RESOURCES + uniqueName + '/offset.json')
			.then(data => {
				this.offsets[uniqueName].data = data
			})
	}

	getTypeColorId(figure: string, part: string): number {
		const avatarInfo = new Avatar(figure, 0, 0, ['std'], 'std', 0, false, false, 'd')
		let color = 0x000000

		for (let figurePart of avatarInfo.figure) {
			if (figurePart.type === part) {
				const parts = this.getPartColor(figurePart)
				for (let type in parts) {
					const part = parts[type]
					for (let particle of part) {
						if (particle.color != null) {
							color = parseInt(particle.color, 16)
							return color
						}
					}
				}
			}
		}
	
		return color
	}

	getChatColor(figure: string): number {
		return this.getTypeColorId(figure, 'ch')
	}

	generateGeneric(avatarInfo: Avatar, isGhost: boolean): Promise(<HTMLCanvasElement>)
	{
		const activeParts: any = {}

		activeParts.rect = this.getActivePartSet(avatarInfo.isHeadOnly ?  'head' : 'figure')
		activeParts.head = this.getActivePartSet('head')
		activeParts.eye = this.getActivePartSet('eye')
		activeParts.gesture = this.getActivePartSet('gesture')
		activeParts.speak = this.getActivePartSet('speak')
		activeParts.walk = this.getActivePartSet('walk')
		activeParts.sit = this.getActivePartSet('sit')
		activeParts.
		
	}

	getActivePartSet() {

	}
}