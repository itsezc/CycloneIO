import Constants from '../../network/constants.json'

export default class Room {

	constructor(scene, socket, id) {
		this.scene = scene
		this.socket = socket
		this.id = id
	}

	create() {

		this.socket.emit(Constants.common.actions.room.NEW_ROOM, this.id,
			[
				[1, 1, 1, 1, 0, 0],
				[1, 1, 1, 1, 1, 0, [1, 2], 0, 0, [1, 3]]
			]
		)

		this.socket.on(Constants.common.actions.room.NEW_TILE, (x, y, z, thickness, leftBorder, bottomBorder) => {
			var tile = this.drawTile(x, y - z, thickness, leftBorder, bottomBorder)
			var hover

			console.log(z)

			tile.on(Constants.client.events.MOUSE_HOVER, () => {
				hover = this.scene.add.image(x, y - z, Constants.client.assets.TILE_HOVER).setOrigin(0.5, 0.1)
			})

			tile.on(Constants.client.events.MOUSE_OUT, () => {
				hover.destroy()
			})
		})
	}

	drawTile(x, y, thickness, leftBorder, bottomBorder) {
		const width = 64
		const height = 32

		const vertices = {
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

		const hitArea = new Phaser.Geom.Polygon([
			vertices.left.x, vertices.left.y,
			vertices.top.x, vertices.top.y,
			vertices.bottom.x, vertices.bottom.y,
			vertices.right.x, vertices.right.y,
		])

		var tile = this.scene.add.graphics()

		tile.setInteractive(hitArea, Phaser.Geom.Polygon.Contains)

		tile.lineStyle(1, 0x8E8E5E)
		tile.fillStyle(0x989865)

		tile.beginPath()

		tile.moveTo(vertices.left.x, vertices.left.y)

		hitArea.points.forEach((point) => {
			tile.lineTo(point.x, point.y)
		})

		tile.fillPath()
		tile.strokePath()
		
		if (leftBorder && thickness > 0) {
			tile.lineStyle(1, 0x7A7A51)
			tile.fillStyle(0x838357)

			tile.beginPath()

			tile.moveTo(vertices.top.x, vertices.top.y)
			tile.lineTo(vertices.top.x, vertices.top.y + thickness)
			tile.lineTo(vertices.bottom.x, vertices.bottom.y + thickness)
			tile.lineTo(vertices.bottom.x, vertices.bottom.y)

			tile.fillPath()
			tile.strokePath()
		}

		if (bottomBorder && thickness > 0) {
			tile.fillStyle(0x6F6F49)
			tile.lineStyle(1, 0x676744)

			tile.beginPath()

			tile.moveTo(vertices.right.x, vertices.right.y)
			tile.lineTo(vertices.right.x, vertices.right.y + thickness)
			tile.lineTo(vertices.bottom.x, vertices.bottom.y + thickness)
			tile.lineTo(vertices.bottom.x, vertices.bottom.y)

			tile.fillPath()
			tile.strokePath()
		}

		return tile
	}
}
