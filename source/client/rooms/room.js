import Constants from '../../network/constants.json'

export default class Room {

	constructor(scene, socket, id) {
		this.scene = scene
		this.socket = socket
	}

	create() {

		this.socket.emit(Constants.common.actions.room.NEW_ROOM)

		this.socket.on(Constants.common.actions.room.NEW_ROOM, (map) => {

			map.forEach((squares, row) => {

				squares.forEach((square, index) => {

					// Awful code

					let x = (row * 32) + (index * 32)
					let y = ((row * 32) - (index * 32)) / 2
					let z = square[1] * 32 || 0
					let height = square[1] || 0
					let depth = row - index
					let wallLeft
					let wallRight

					if (map[row - 1] === undefined) {
						wallLeft = this.scene.add.image(x, y, Constants.client.assets.WALL_LEFT)
						wallLeft.setOrigin(1, 0.97)
						wallLeft.setDepth(depth - 1)
					}

					if (squares[index + 1] === undefined) {
						wallRight = this.scene.add.image(x, y, Constants.client.assets.WALL_RIGHT)
						wallRight.setOrigin(0, 0.97)
						wallRight.setDepth(depth - 1)
					}

					if (square !== 0) {

						let tile
						let hover
						let stairRight

						if (squares[index + 1] !== undefined) {
							let rightHeight = squares[index + 1][1] || 0
							let deltaHeight = Math.abs(rightHeight - height)

							if (deltaHeight === 1) {
								stairRight = this.scene.add.image(x, y - z, Constants.client.assets.STAIR_RIGHT)

								stairRight.setOrigin(0.49, 0.72)
								stairRight.setDepth(depth)
								stairRight.setInteractive({
									pixelPerfect: true
								})

								stairRight.on(Constants.client.events.MOUSE_HOVER, () => {
									hover = this.scene.add.image(x, y - z, Constants.client.assets.TILE_HOVER)
									hover.setOrigin(0.5, 0.6)
									hover.setDepth(depth + 1)
								})

								stairRight.on(Constants.client.events.MOUSE_OUT, () => {
									hover.destroy()
								})
							} else {
								tile = this.scene.add.image(x, y - z, Constants.client.assets.TILE)

								tile.setDepth(depth)
								tile.setInteractive({
									pixelPerfect: true
								})

								tile.on(Constants.client.events.MOUSE_HOVER, () => {
									hover = this.scene.add.image(x, y - z, Constants.client.assets.TILE_HOVER)
									hover.setOrigin(0.5, 0.6)
									hover.setDepth(depth + 1)
								})

								tile.on(Constants.client.events.MOUSE_OUT, () => {
									hover.destroy()
								})
							}

						} else {
							tile = this.scene.add.image(x, y - z, Constants.client.assets.TILE)

							tile.setDepth(depth)
							tile.setInteractive({
								pixelPerfect: true
							})

							tile.on(Constants.client.events.MOUSE_HOVER, () => {
								hover = this.scene.add.image(x, y - z, Constants.client.assets.TILE_HOVER)
								hover.setOrigin(0.5, 0.6)
								hover.setDepth(depth + 1)
							})

							tile.on(Constants.client.events.MOUSE_OUT, () => {
								hover.destroy()
							})
						}
					}
				})
			})
		})
	}
	//
	// ground.forEach((squares, row) => {
	//
	//     squares.forEach((square, index) => {
	//
	//         if (square !== 0) {
	//
	//             let x = (row * 32) + (index * 32)
	//             let y = ((row * 32) - (index * 32)) / 2
	//             let z = square[1] * 32 || 0
	//             let height = square[1]
	//
	//
	//             this.drawTile(x, y, row - index)
	//         }
	//     })
	// })
	//
	// this.tiles.getChildren().forEach(tile => {
	//     tile.setInteractive({
	//         pixelPerfect: true
	//     })
	//
	// 	var hoverTile
	//
	//     tile.on('pointerover', () => {
	//         hoverTile = this.tiles.create(
	//             tile.x,
	//             tile.y,
	//             Constants.client.assets.TILE_HOVER
	//         ).setOrigin(0, 0.05).setDepth(1000)
	//     })
	//
	//     tile.on('pointerout', () => {
	//         hoverTile.destroy()
	//     })
	//
	// })

	// this.socket.on(Constants.common.actions.room.NEW_TILE, (x, y, z, thickness, leftBorder, bottomBorder) => {
	//
	// 	this.drawTile(x, y, thickness, leftBorder, bottomBorder)
	// 	// tile.generateTexture('test')
	// 	// this.scene.add.image(x, y, 'test')
	// 	// let hover
	// 	//
	// 	// tile.on(Constants.client.events.MOUSE_HOVER, () => {
	// 	// 	hover = this.scene.add.image(x, y - z, Constants.client.assets.TILE_HOVER).setOrigin(0.5, 0.1)
	// 	// })
	// 	//
	// 	// tile.on(Constants.client.events.MOUSE_OUT, () => {
	// 	// 	hover.destroy()
	// 	// })
	// 	//
	// 	//this.drawWall(x, y, 120, 7.5, thickness, true, true)
	//
	// })
}

//
//     drawTile(x, y, index) {
//
//         this.tiles.create(
//             x, y, 'tile').setOrigin(0).setDepth(index)
//
//         // let width = 32
//         // let height = 32
//         //
//         // let vertices = {
//         // 	left: {
//         // 		x: x - width,
//         // 		y: y + height / 2
//         // 	},
//         //
//         // 	top: {
//         // 		x: x,
//         // 		y: y
//         // 	},
//         //
//         // 	bottom: {
//         // 		x: x,
//         // 		y: y + height
//         // 	},
//         //
//         // 	right: {
//         // 		x: x + width,
//         // 		y: y + height / 2
//         // 	}
//         // }
//         //
//         // let hitArea = new Phaser.Geom.Polygon([
//         // 	0, 0,
//         // 	32, -16,
//         // 	64, 0,
//         // 	32, 16
//         // ])
//         //
//         // let wall = this.scene.add.graphics() // testing
//         //
//         // // let top = this.scene.add.graphics()
//         // // let left = this.scene.add.graphics()
//         // // let bottom = this.scene.add.graphics()
//         //
//         // // wall.fillStyle(0x989865)
//         // // wall.fillPoints(hitArea.points)
//         //
//         // wall.lineStyle(1, 0x8E8E5E)
//         // wall.lineBetween(0, 0, 32, -16)
//         // wall.lineBetween(32, -16, 64, 0)
//         //
//         // let leftEdge = new Phaser.Geom.Polygon([
//         // 	0, 8,
//         // 	0, 0,
//         // 	30, 15,
//         // 	30, 23
//         // ])
//         //
//         // wall.fillStyle(0x838357)
//         // wall.fillPoints(leftEdge.points)
//         //
//         // wall.lineStyle(1, 0x7A7A51)
//         // wall.lineBetween(0, 8, 1, 1)
//         //
//         // wall.lineStyle(0.5, 0x7A7A51)
//         // wall.lineBetween(0.5, 0.5, 31, 16)
//         //
//         // // wall.lineStyle(0.5, 0x7A7A51)
//         // // wall.lineBetween(1, 0, 32, 16)
//         // // wall.lineBetween(64, 0, 32, 16)
//         // // top.lineBetween(vertices.bottom.x, vertices.bottom.y, vertices.right.x, vertices.right.y)
//         // // top.lineBetween(vertices.top.x, vertices.top.x, vertices.left.x, vertices.left.y)
//         // //
//         // // top.lineStyle(1, 0x8E8E5E)
//         // // top.lineBetween(vertices.right.x, vertices.right.y, vertices.top.x, vertices.top.y)
//         // // top.setInteractive(hitArea, Phaser.Geom.Polygon.Contains)
//         //
//         // if (leftBorder && thickness > 0) {
//         //
//         // 	// let leftEdge = new Phaser.Geom.Polygon([
//         // 	// 	vertices.bottom.x, vertices.bottom.y + thickness,
//         // 	// 	vertices.bottom.x, vertices.bottom.y,
//         // 	// 	vertices.left.x, vertices.left.y,
//         // 	// 	vertices.left.x, vertices.left.y + thickness
//         // 	// ])
//         // 	//
//         // 	// left.fillStyle(0x838357)
//         // 	// left.fillPoints(leftEdge.points)
//         // 	//
//         // 	// left.lineStyle(1, 0x7A7A51)
//         // 	// left.strokePoints(leftEdge.points, true)
//         // }
//         //
//         // if (bottomBorder && thickness > 0) {
//         //
//         // 	// let bottomEdge = new Phaser.Geom.Polygon([
//         // 	// 	vertices.right.x, vertices.right.y + thickness,
//         // 	// 	vertices.right.x, vertices.right.y,
//         // 	// 	vertices.bottom.x, vertices.bottom.y,
//         // 	// 	vertices.bottom.x, vertices.bottom.y + thickness
//         // 	// ])
//         // 	//
//         // 	// bottom.fillStyle(0x6F6F49)
//         // 	// bottom.fillPoints(bottomEdge.points, true)
//         // 	//
//         // 	// bottom.lineStyle(0.5, 0x676744)
//         // 	// bottom.strokePoints(bottomEdge.points, true)
//         // }
//         //
//         // wall.setScale(this.scaleRatio / 3)
//     }
//
//     drawWall(x, y, height, thickness, squareThickness, rightBorder, topBorder) {
//
//         let width = 33
//
//         let bottomFront = this.scene.add.graphics()
//         let bottomEdge = this.scene.add.graphics()
//         let bottomTopEdge = this.scene.add.graphics()
//
//         let rightFront = this.scene.add.graphics()
//         let rightEdge = this.scene.add.graphics()
//         let rightTopEdge = this.scene.add.graphics()
//
//         let vertices
//         let hitArea
//
//         if (topBorder) {
//
//             vertices = {
//                 right: {
//                     x: x,
//                     y: y
//                 },
//
//                 top: {
//                     x: x,
//                     y: y - height
//                 },
//
//                 left: {
//                     x: x - width,
//                     y: (y + width / 2) - height
//                 },
//
//                 bottom: {
//                     x: x - width,
//                     y: y + width / 2
//                 }
//             }
//
//             hitArea = new Phaser.Geom.Polygon([
//                 vertices.bottom.x, vertices.bottom.y,
//                 vertices.left.x, vertices.left.y,
//                 vertices.top.x, vertices.top.y,
//                 vertices.right.x, vertices.right.y
//             ])
//
//             // wall.setInteractive(hitArea, Phaser.Geom.Polygon.Contains)
//
//             bottomFront.fillStyle(0x90929E)
//             bottomFront.fillPoints(hitArea.points, true)
//
//             bottomFront.lineStyle(1, 0x90929E)
//             bottomFront.strokePoints(hitArea.points, true)
//
//             if (thickness > 0) {
//
//                 let bottomEdgeShape = new Phaser.Geom.Polygon([
//                     vertices.bottom.x, vertices.bottom.y + squareThickness,
//                     vertices.bottom.x - thickness, vertices.bottom.y - thickness / 2 + squareThickness,
//                     vertices.left.x - thickness, vertices.left.y - thickness / 2,
//                     vertices.left.x, vertices.left.y,
//                     vertices.bottom.x, vertices.bottom.y + squareThickness
//                 ])
//
//                 bottomEdge.fillStyle(0xBBBECD)
//                 bottomEdge.fillPoints(bottomEdgeShape.points, true)
//
//                 bottomEdge.lineStyle(1, 0xBBBECD)
//                 bottomEdge.strokePoints(bottomEdgeShape.points, true)
//
//
//                 let bottomTopEdgeShape = new Phaser.Geom.Polygon([
//                     vertices.left.x - thickness, vertices.left.y - thickness / 2,
//                     vertices.top.x, vertices.top.y - thickness,
//                     vertices.top.x, vertices.top.y,
//                     vertices.left.x, vertices.left.y
//                 ])
//
//                 bottomTopEdge.fillStyle(0x6F717A)
//                 bottomTopEdge.fillPoints(bottomTopEdgeShape.points, true)
//
//                 bottomTopEdge.lineStyle(0.5, 0x6F717A)
//                 bottomTopEdge.strokePoints(bottomTopEdgeShape.points, true)
//             }
//         }
//
//         if (rightBorder) {
//
//             vertices = {
//                 left: {
//                     x: x,
//                     y: y
//                 },
//
//                 top: {
//                     x: x,
//                     y: y - height
//                 },
//
//                 right: {
//                     x: x + width,
//                     y: y + width / 2 - height
//                 },
//
//                 bottom: {
//                     x: x + width,
//                     y: y + width / 2
//                 }
//             }
//
//             hitArea = new Phaser.Geom.Polygon([
//                 vertices.right.x, vertices.right.y,
//                 vertices.top.x, vertices.top.y,
//                 vertices.left.x, vertices.left.y,
//                 vertices.bottom.x, vertices.bottom.y
//             ])
//
//             // wall.setInteractive(hitArea, Phaser.Geom.Polygon.Contains)
//
//             rightFront.fillStyle(0xB6B8C7)
//             rightFront.fillPoints(hitArea.points, true)
//
//             rightFront.lineStyle(1, 0xB6B8C7)
//             rightFront.strokePoints(hitArea.points, true)
//
//             rightFront.setDepth(1)
//
//             if (thickness > 0) {
//
//                 let rightEdgeShape = new Phaser.Geom.Polygon([
//                     vertices.right.x + thickness, vertices.right.y - thickness / 2,
//                     vertices.right.x, vertices.right.y,
//                     vertices.bottom.x, vertices.bottom.y + squareThickness,
//                     vertices.bottom.x + thickness, vertices.bottom.y - thickness / 2 + squareThickness,
//                 ])
//
//                 rightEdge.fillStyle(0x9597A3)
//                 rightEdge.fillPoints(rightEdgeShape.points, true)
//
//                 rightEdge.lineStyle(0.5, 0x9597A3)
//                 rightEdge.strokePoints(rightEdgeShape.points, true)
//
//                 let rightTopEdgeShape = new Phaser.Geom.Polygon([
//                     vertices.right.x + thickness, vertices.right.y - thickness / 2,
//                     vertices.top.x, vertices.top.y - thickness,
//                     vertices.top.x, vertices.top.y,
//                     vertices.right.x, vertices.right.y
//                 ])
//
//                 rightTopEdge.fillStyle(0x6F717A)
//                 rightTopEdge.fillPoints(rightTopEdgeShape.points, true)
//
//                 rightTopEdge.lineStyle(0.5, 0x6F717A)
//                 rightTopEdge.strokePoints(rightTopEdgeShape.points, true)
//             }
//         }
//     }
//
//     //
//     // wall.on('pointerdown', () => {
//     // 	console.log('Clicked wall')
//     // })
// }
