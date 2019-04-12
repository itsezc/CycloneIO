import Constants from '../../network/constants.json'

export default class Room {
	constructor(scene, socket, id) {
		this.scene = scene
		this.socket = socket
		this.id = id
	}

	create() {
		this.tiles = this.scene.add.group()

		this.socket.emit(Constants.common.actions.room.NEW_ROOM, this.id, [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[1, 1, 1, 1]
		])

		this.socket.on(Constants.common.actions.room.NEW_TILE, (x, y, thickness, leftBorder, bottomBorder) => {
			const tile = this.drawTile(x, y, thickness, leftBorder, bottomBorder)

			this.tiles.add(tile)
			// tile.setInteractive()
			// tile.on('pointerover', () => {
			// 	console.log('hi')
			// })
			//
			// console.log(tile)
		})


	}

	update() {
		this.tiles.getChildren().forEach((tile) => {
			//console.log('hi')
			tile.on('pointerover', () => {
				console.log('hi')
			})
		})
	}

	drawTile(x, y, thickness, leftBorder, bottomBorder) {
		const width = 64
		const height = 32

		const tile = this.scene.add.graphics()
		const vertices = {
			surface: {
				left: {
					x: x,
					y: y
				},
				top: {
					x: x - width / 2,
					y: y + height / 2
				},
				bottom: {
					x: x,
					y: y + height
				},
				right: {
					x: x + width / 2,
					y: y + height / 2
				}
			}
		}

		tile.lineStyle(1, 0x8E8E5E)
		tile.fillStyle(0x989865)

		tile.beginPath()

		tile.moveTo(vertices.surface.left.x, vertices.surface.left.y)
		tile.lineTo(vertices.surface.top.x, vertices.surface.top.y)
		tile.lineTo(vertices.surface.bottom.x, vertices.surface.bottom.y)
		tile.lineTo(vertices.surface.right.x, vertices.surface.right.y)
		tile.lineTo(vertices.surface.left.x, vertices.surface.left.y)

		tile.fillPath()
		tile.strokePath()
		//
		// tile.setInteractive({
		// 	pixelPerfect: true
		// })
		//
		// if (leftBorder && thickness > 0) {
		// 	tile.lineStyle(1, 0x7A7A51)
		// 	tile.fillStyle(0x838357)
		//
		// 	tile.beginPath()
		//
		// 	tile.moveTo(x - width / 2, y + height / 2)
		// 	tile.lineTo(x - width / 2, y + height / 2 + thickness)
		// 	tile.lineTo(x, y + height + thickness)
		// 	tile.lineTo(x, y + height)
		//
		// 	tile.fillPath()
		// 	tile.strokePath()
		// }
		//
		// if (bottomBorder && thickness > 0) {
		// 	tile.fillStyle(0x6F6F49)
		// 	tile.lineStyle(1, 0x676744)
		//
		// 	tile.beginPath()
		//
		// 	tile.moveTo(x + width / 2, y + height / 2)
		// 	tile.lineTo(x + width / 2, y + height / 2 + thickness)
		// 	tile.lineTo(x, y + height + thickness)
		// 	tile.lineTo(x, y + height)
		//
		// 	tile.fillPath()
		// 	tile.strokePath()
		// }

		return tile
	}
}
