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
				[1]
			]
		)

		this.socket.on(Constants.common.actions.room.NEW_TILE, (x, y, z, thickness, leftBorder, bottomBorder) => {
			var tile = this.drawTile(x, y - z, thickness, leftBorder, bottomBorder)
			var hover

			tile.on(Constants.client.events.MOUSE_HOVER, () => {
				hover = this.scene.add.image(x, y - z, Constants.client.assets.TILE_HOVER).setOrigin(0.5, 0.1)
			})

			tile.on(Constants.client.events.MOUSE_OUT, () => {
				hover.destroy()
			})

			this.drawWall(x, y, 120, 7.5, thickness, true, true)
		})
	}

	drawTile(x, y, thickness, leftBorder, bottomBorder) {
		const width = 32
		const height = 32

		const vertices = {
			left: {
				x: x,
				y: y
			},
			top: {
				x: x - width,
				y: y + height / 2
			},
			bottom: {
				x: x,
				y: y + height
			},
			right: {
				x: x + width,
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

	drawWall(x, y, height, thickness, depth, rightBorder, topBorder) {
		const width = 32

		var wall = this.scene.add.graphics()
		var vertices
		var hitArea

		if (rightBorder) {

			vertices = {
				left: {
					x: x,
					y: y
				},
				top: {
					x: x,
					y: y - height
				},
				right: {
					x: x + width,
					y: y + width / 2 - height
				},
				bottom: {
					x: x + width,
					y: y + width / 2
				}
			}

			hitArea = new Phaser.Geom.Polygon([
				vertices.left.x, vertices.left.y,
				vertices.top.x, vertices.top.y,
				vertices.right.x, vertices.right.y,
				vertices.bottom.x, vertices.bottom.y,
			])

			wall.lineStyle(0, 0xB6B8C7)
			wall.fillStyle(0xB6B8C7)

			wall.beginPath()

			wall.moveTo(vertices.left.x, vertices.left.y)

			hitArea.points.forEach((point) => {
				wall.lineTo(point.x, point.y)
			})

			wall.fillPath()
			wall.strokePath()
		}

		if (topBorder) {

			vertices = {
				right: {
					x: x,
					y: y
				},
				top: {
					x: x,
					y: y - height
				},
				left: {
					x: x - width,
					y: (y + width / 2) - height
				},
				bottom: {
					x: x - width,
					y: y + width / 2
				}
			}

			hitArea = new Phaser.Geom.Polygon([
				vertices.right.x, vertices.right.y,
				vertices.top.x, vertices.top.y,
			    vertices.left.x, vertices.left.y,
				vertices.bottom.x, vertices.bottom.y,
			])

			wall.lineStyle(1, 0x90929E)
			wall.fillStyle(0x90929E)

			wall.beginPath()

			wall.moveTo(vertices.right.x, vertices.right.y)

			hitArea.points.forEach((point) => {
				wall.lineTo(point.x, point.y)
			})

			wall.fillPath()
			wall.strokePath()
		}

		wall.setInteractive(hitArea, Phaser.Geom.Polygon.Contains)

		wall.on('pointerdown', () => {
			console.log('Clicked wall')
		})

		return wall
	}
}
