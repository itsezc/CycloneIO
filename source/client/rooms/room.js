import Constants from '../../network/constants.json'

export default class Room {

	constructor(scene, socket, id) {
		this.scene = scene
		this.socket = socket
		this.id = id
	}

	create() {

		this.socket.emit(Constants.common.actions.room.NEW_ROOM)

		this.socket.on(Constants.common.actions.room.NEW_TILE, (x, y, z, thickness, leftBorder, bottomBorder) => {

			let tile = this.drawTile(x, y - z, thickness, leftBorder, bottomBorder)
			tile.generateTexture('test')
			this.scene.add.image(x, y, 'test')
			// let hover
			//
			// tile.on(Constants.client.events.MOUSE_HOVER, () => {
			// 	hover = this.scene.add.image(x, y - z, Constants.client.assets.TILE_HOVER).setOrigin(0.5, 0.1)
			// })
			//
			// tile.on(Constants.client.events.MOUSE_OUT, () => {
			// 	hover.destroy()
			// })
			//
			// var wall = this.drawWall(x, y, 120, 7.5, thickness, true, true)
		})
	}

	drawTile(x, y, thickness, leftBorder, bottomBorder) {

		let width = 32
		let height = 32

		let vertices = {
			left: {
				x: x - width,
				y: y + height / 2
			},

			top: {
				x: x,
				y: y
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

		let hitArea = new Phaser.Geom.Polygon([
			vertices.left.x, vertices.left.y,
			vertices.top.x, vertices.top.y,
			vertices.right.x, vertices.right.y,
			vertices.bottom.x, vertices.bottom.y
		])

		let tile = this.scene.make.graphics({
			add: false
		})

		tile.fillStyle(0x989865)

		tile.fillPoints(hitArea.points, true)

		tile.lineStyle(1, 0x8E8E5E)

		tile.strokePoints(hitArea.points, true)

		tile.setInteractive(hitArea, Phaser.Geom.Polygon.Contains)

		// if (leftBorder && thickness > 0) {
		//
		// 	let leftEdge = new Phaser.Geom.Polygon([
		// 		vertices.left.x, vertices.left.y + thickness,
		// 		vertices.left.x, vertices.left.y,
		// 		vertices.bottom.x, vertices.bottom.y,
		// 		vertices.bottom.x, vertices.bottom.y + thickness,
		// 		vertices.left.x, vertices.left.y + thickness
		// 	])
		//
		// 	tile.lineStyle(1, 0x7A7A51)
		//
		// 	tile.strokePoints(leftEdge.points)
		//
		// 	tile.fillStyle(0x838357)
		//
		// 	tile.fillPoints(leftEdge.points)
		// }
		//
		// if (bottomBorder && thickness > 0) {
		//
		// 	let bottomEdge = new Phaser.Geom.Polygon([
		// 		vertices.right.x, vertices.right.y + thickness,
		// 		vertices.right.x, vertices.right.y,
		// 		vertices.bottom.x, vertices.bottom.y,
		// 		vertices.bottom.x, vertices.bottom.y + thickness
		// 	])
		//
		// 	tile.lineStyle(1, 0x676744)
		//
		// 	tile.strokePoints(bottomEdge.points)
		//
		// 	tile.fillStyle(0x6F6F49)
		//
		// 	tile.fillPoints(bottomEdge.points)
		// }

		return tile
	}

	drawWall(x, y, height, thickness, squareThickness, rightBorder, topBorder) {

		let width = 32

		let wall = this.scene.add.graphics()
		let vertices
		let hitArea

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
				vertices.right.x, vertices.right.y,
				vertices.top.x, vertices.top.y,
				vertices.left.x, vertices.left.y,
				vertices.bottom.x, vertices.bottom.y
			])

			// wall.setInteractive(hitArea, Phaser.Geom.Polygon.Contains)

			wall.lineStyle(0.5, 0xB6B8C7)

			wall.strokePoints(hitArea.points)

			wall.fillStyle(0xB6B8C7)

			wall.fillPoints(hitArea.points)

			if (thickness > 0) {

				let leftEdge = new Phaser.Geom.Polygon([
					vertices.bottom.x, vertices.bottom.y + squareThickness,
					vertices.bottom.x + thickness, vertices.bottom.y - thickness / 2 + squareThickness,
					vertices.right.x + thickness, vertices.right.y - thickness / 2,
					vertices.right.x, vertices.right.y
				])

				wall.lineStyle(0.5, 0x9597A3)

				wall.strokePoints(leftEdge.points)

				wall.fillStyle(0x9597A3)

				wall.fillPoints(leftEdge.points)

				let topEdge = new Phaser.Geom.Polygon([
					vertices.right.x + thickness, vertices.right.y - thickness / 2,
					vertices.top.x, vertices.top.y - thickness,
					vertices.top.x, vertices.top.y,
					vertices.right.x, vertices.right.y
				])

				wall.lineStyle(0.5, 0x6F717A)

				wall.strokePoints(topEdge.points)

				wall.fillStyle(0x6F717A)

				wall.fillPoints(topEdge.points)
			}
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
				vertices.bottom.x, vertices.bottom.y,
				vertices.left.x, vertices.left.y,
				vertices.top.x, vertices.top.y,
				vertices.right.x, vertices.right.y,
				vertices.bottom.x, vertices.bottom.y
			])


			// wall.setInteractive(hitArea, Phaser.Geom.Polygon.Contains)

			wall.lineStyle(0.5, 0x90929E)

			wall.strokePoints(hitArea.points)

			wall.fillStyle(0x90929E)

			wall.fillPoints(hitArea.points)

			if (thickness > 0) {

				let leftEdge = new Phaser.Geom.Polygon([
					vertices.bottom.x, vertices.bottom.y + squareThickness,
					vertices.bottom.x - thickness, vertices.bottom.y - thickness / 2 + squareThickness,
					vertices.left.x - thickness, vertices.left.y - thickness / 2,
					vertices.left.x, vertices.left.y,
					vertices.bottom.x, vertices.bottom.y + squareThickness
				])

				wall.lineStyle(0.5, 0xBBBECD)

				wall.strokePoints(leftEdge.points)

				wall.fillStyle(0xBBBECD)

				wall.fillPoints(leftEdge.points)

				let topEdge = new Phaser.Geom.Polygon([
					vertices.left.x - thickness, vertices.left.y - thickness / 2,
					vertices.top.x, vertices.top.y - thickness,
					vertices.top.x, vertices.top.y,
					vertices.left.x, vertices.left.y
				])

				wall.lineStyle(0.5, 0x6F717A)

				wall.strokePoints(topEdge.points)

				wall.fillStyle(0x6F717A)

				wall.fillPoints(topEdge.points)
			}
		}

		return wall
	}

	//
	// wall.on('pointerdown', () => {
	// 	console.log('Clicked wall')
	// })
}
