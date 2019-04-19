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

			this.drawTile(x, y - z, thickness, leftBorder, bottomBorder)
			// tile.generateTexture('test')
			// this.scene.add.image(x, y, 'test')
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
			this.drawWall(x, y, 120, 7.5, thickness, true, true)

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

		let top = this.scene.add.graphics()
		let left = this.scene.add.graphics()
		let bottom = this.scene.add.graphics()

		top.fillStyle(0x989865)
		top.fillPoints(hitArea.points)

		top.lineStyle(1, 0x8E8E5E)
		top.lineBetween(vertices.left.x, vertices.left.y, vertices.bottom.x, vertices.bottom.y)
		top.lineBetween(vertices.bottom.x, vertices.bottom.y, vertices.right.x, vertices.right.y)
		top.lineBetween(vertices.top.x, vertices.top.x, vertices.left.x, vertices.left.y)

		top.lineStyle(0.5, 0x8E8E5E)
		top.lineBetween(vertices.right.x, vertices.right.y, vertices.top.x, vertices.top.y)

		top.setDepth(2)

		top.setInteractive(hitArea, Phaser.Geom.Polygon.Contains)

		// if (bottomBorder && thickness > 0) {
		//
		// 	let bottomEdge = new Phaser.Geom.Polygon([
		// 		vertices.right.x, vertices.right.y + thickness,
		// 		vertices.right.x, vertices.right.y,
		// 		vertices.bottom.x, vertices.bottom.y,
		// 		vertices.bottom.x, vertices.bottom.y + thickness
		// 	])
		//
		// 	bottom.fillStyle(0x6F6F49)
		// 	bottom.fillPoints(bottomEdge.points, true)
		//
		// 	bottom.lineStyle(0.5, 0x676744)
		// 	bottom.strokePoints(bottomEdge.points, true)
		//
		// 	bottom.setDepth(4)
		// }
	}

	drawWall(x, y, height, thickness, squareThickness, rightBorder, topBorder) {

		let width = 32

		let bottomFront = this.scene.add.graphics()
		let bottomEdge = this.scene.add.graphics()
		let bottomTopEdge = this.scene.add.graphics()

		let rightFront = this.scene.add.graphics()
		let rightEdge = this.scene.add.graphics()
		let rightTopEdge = this.scene.add.graphics()

		let vertices
		let hitArea

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

			bottomFront.fillStyle(0x90929E)
			bottomFront.fillPoints(hitArea.points, true)

			// bottomFront.lineStyle(0.5, 0x90929E)
			// bottomFront.strokePoints(hitArea.points, true)

			bottomFront.setDepth(3)

			// if (thickness > 0) {
			//
			// 	let bottomEdgeShape = new Phaser.Geom.Polygon([
			// 		vertices.bottom.x, vertices.bottom.y + squareThickness,
			// 		vertices.bottom.x - thickness, vertices.bottom.y - thickness / 2 + squareThickness,
			// 		vertices.left.x - thickness, vertices.left.y - thickness / 2,
			// 		vertices.left.x, vertices.left.y,
			// 		vertices.bottom.x, vertices.bottom.y + squareThickness
			// 	])
			//
			// 	bottomEdge.fillStyle(0xBBBECD)
			// 	bottomEdge.fillPoints(bottomEdgeShape.points, true)
			//
			// 	bottomEdge.lineStyle(0.5, 0xBBBECD)
			// 	bottomEdge.strokePoints(bottomEdgeShape.points, true)
			//
			// 	bottomEdge.setDepth(5)
			//
			// 	let bottomTopEdgeShape = new Phaser.Geom.Polygon([
			// 		vertices.left.x - thickness, vertices.left.y - thickness / 2,
			// 		vertices.top.x, vertices.top.y - thickness,
			// 		vertices.top.x, vertices.top.y,
			// 		vertices.left.x, vertices.left.y
			// 	])
			//
			// 	bottomTopEdge.fillStyle(0x6F717A)
			// 	bottomTopEdge.fillPoints(bottomTopEdgeShape.points, true)
			//
			// 	bottomTopEdge.lineStyle(0.5, 0x6F717A)
			// 	bottomTopEdge.strokePoints(bottomTopEdgeShape.points, true)
			//
			// 	bottomTopEdge.setDepth(1)
			// }
		}

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

			rightFront.fillStyle(0xB6B8C7)
			rightFront.fillPoints(hitArea.points, true)
			// //
			// rightFront.lineStyle(0.5, 0xB6B8C7)
			// rightFront.strokePoints(hitArea.points)
			//
			rightFront.setDepth(3)

			if (thickness > 0) {

				let rightEdgeShape = new Phaser.Geom.Polygon([
					vertices.right.x + thickness, vertices.right.y - thickness / 2,
					vertices.right.x, vertices.right.y,
					vertices.bottom.x, vertices.bottom.y + squareThickness,
					vertices.bottom.x + thickness, vertices.bottom.y - thickness / 2 + squareThickness,
				])

				// rightEdge.fillStyle(0x9597A3)
				// rightEdge.fillPoints(rightEdgeShape.points, true)
				//
				// rightEdge.lineStyle(0.5, 0x9597A3)
				// rightEdge.strokePoints(rightEdgeShape.points, true)
				//
				// rightEdge.setDepth(5)

				// let rightTopEdgeShape = new Phaser.Geom.Polygon([
				// 	vertices.right.x + thickness, vertices.right.y - thickness / 2,
				// 	vertices.top.x, vertices.top.y - thickness,
				// 	vertices.top.x, vertices.top.y,
				// 	vertices.right.x, vertices.right.y
				// ])
				//
				// rightTopEdge.fillStyle(0x6F717A)
				// rightTopEdge.fillPoints(rightTopEdgeShape.points, true)
				//
				// rightTopEdge.lineStyle(0.5, 0x6F717A)
				// rightTopEdge.strokePoints(rightTopEdgeShape.points, true)
				//
				// rightTopEdge.setDepth(3)
			}
		}
	}

	//
	// wall.on('pointerdown', () => {
	// 	console.log('Clicked wall')
	// })
}
