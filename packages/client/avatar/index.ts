export interface FigurePart { type: string, id: string, colors: string[] }

export type Direction = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7

export type Scale = 'l' | 's' | 'd' | 'n'

export type Gender = 'M' | 'F'

export interface DrawAction {
    body: string,
    wlk?: string,
    sit?: string,
    gesture?: string,
    eye?: string,
    speak?: string,
    itemRight?: string,
    handRight?: string,
    handLeft?: string,
    swm?: string
}

export interface TextureDictionary {
    [id: string]: Phaser.Textures.Texture;
}

export default class Avatar 
{
	figure: FigurePart[]

	rectWidth: number
	rectHeight: number
	isDownsampled: boolean
	drawAction: DrawAction
	drawOrder: string

	isLarge: boolean
	isSmall: boolean

	handItem: number
	effect: number
	
	constructor(
		figure: string,
		public readonly direction: Direction,
		public readonly headDirection: Direction,
		public readonly action: string[],
		public readonly gesture: string,
		public readonly frame: number,
		public readonly isHeadOnly: boolean,
		public readonly isBodyOnly: boolean,
		public readonly scale: Scale
	) {
		switch(this.scale) {
			case 'l':
				this.isLarge = true
				this.rectWidth = 128
				this.rectHeight = 220
			break
			
			case 's':
				this.isSmall = true
				this.rectWidth = 32
				this.rectHeight = 55
			break
		
			case 'd':
				this.isDownsampled = true
			break 

			case 'n':
			default: 
				break
		}

		this.figure = extractFigureParts(figure)
		this.drawAction = {
			body: 'std'
		}
		this.handItem = -1
		this.drawOrder = 'std'
		
		switch(this.gesture) {
			case 'spk':
				this.drawAction.speak = 'spk'
			break

			case 'eyb':
				this.drawAction.eye = 'eyeb'
			break 

			case '':
				this.drawAction.gesture = 'std'
			break 

			default:
				this.drawAction.gesture = this.gesture 
			break
		}


		for(let value of this.action) {
			const actionParams = value.split('=')
			
			switch(actionParams[0]) {
				case 'wlk':
					this.drawAction.wlk = 'wlk'
				break 

				case 'sit':
					this.drawAction.sit = 'sit'
				break 

				case 'lay':
					this.drawAction.body = 'lay'
					this.drawAction.eye = 'lay'
				
					const tmp = this.rectWidth 
					this.rectWidth = this.rectHeight
					this.rectHeight = tmp 

					switch(this.gesture) {
						case 'spk':
							this.drawAction.speak = 'lsp'
						break 

						case 'eyb':
							this.drawAction.eye = 'ley'
						break 

						case 'std':
							this.drawAction.gesture = 'lay'
						break

						default:
							this.drawAction.gesture = 'l' + this.gesture.substr(0, 2)
						break
					}
				break 

				case 'wav':
					this.drawAction.handLeft = 'wav'
				break

				case 'crr':
				case 'drk':
					this.drawAction.handRight = actionParams[0]
					this.drawAction.itemRight = actionParams[0]
					this.handItem = Number(actionParams[1])
				break 

				case 'swm':
					this.drawAction.swm = 'swm'
					this.drawAction.speak = (this.gesture === 'spk') ? 'sws' : null
				
				break

				case '':
					this.drawAction.body = 'std'
				break
			
				default:
					this.drawAction.body = actionParams[0]
				break
			}
		}

		if(this.drawAction.sit === 'sit') {
			if(this.direction >= 2 && this.direction <= 4) {
				this.drawOrder = 'sit'

				if(this.drawAction.handRight === 'drk' && this.direction >= 2 && this.direction <= 3) {
					this.drawOrder += '.rh-up'
				} else if(this.drawAction.handLeft && this.direction === 4) {
					this.drawOrder += '.lh-up'
				}
			} else if(this.drawAction.body === 'lay') {
				this.drawOrder = 'lay'
			} else if(this.drawAction.handRight === 'drk' && this.direction >= 0 && this.direction <= 3) {
				this.drawOrder = 'rh-up'
			} else if(this.drawAction.handLeft && this.direction >= 4 && this.direction <= 6) {
				this.drawOrder = 'lh-up'
			}
		}
	}
}

export const extractFigureParts = (figure: string): FigurePart[] => {
	const newFigure: { [id: string]: FigurePart } = {}
	const figures: FigurePart[] = []

	for(let part of figure.split('.')) {
		const data = part.split('-') 
		const figurePart: FigurePart = {
			type: data[0],
			id: data[1],
			colors: [data[2]]
		}

		if(data[3] != null) {
			figurePart.colors.push(data[3])
		}

		newFigure[figurePart.type] = figurePart
	}
	
	for (let part in newFigure) {
		figures.push(newFigure[part])
	}

	return figures
}

export const generateFigureString = (figure: FigurePart[]): string => {
	let newFigure = ''

	for(let figureElement of figure) {
		let current = figureElement.type + '-' + figureElement.id 
		for(let color of figureElement.colors) {
			current += '-' + color
		}

		newFigure += current + '.'
	}

	return newFigure.substr(0, newFigure.length - 1)
}