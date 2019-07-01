import Room from '../rooms/room'
import RoomObjectDepth from '../../common/enums/rooms/objects/depth'
import { Queue } from 'queue-typescript'

/**
 * @param {object} scene - The room scene
 * @param {object} room - The room
 * @param {object} gameMap - The game map
 */
export default class RoomPlayer {
	private scene: Room
	public players: { [id: string]: Phaser.Physics.Arcade.Sprite }

	constructor(scene: Room) {
		this.scene = scene
		this.players = {}
	}

	/**
	 * Creates and places a player
	 * @param {object} player - The player to add
	 * TODO: player walking animation
	 */
	addPlayerToRoom(playerId: any, playerX: any, playerY: any) {
		var xLocation = this.scene.getScreenX(playerX, playerY)
		var yLocation = this.scene.getScreenY(playerX, playerY)

		this.players[playerId] = this.scene.physics.add.sprite(xLocation + 32, yLocation - 28, 'avatar').setDepth(RoomObjectDepth.FIGURE)
	}

	/**
	 * Removes a player from the room
	 * @param {object} playerId - The socket Id
	 */
	removePlayerFromRoom(playerId: number) {
		var player = this.players[playerId]

		if (player) {
			player.destroy()
		}
	}

	movePlayer(playerId: any, path: any, destination: any) {
		var player = this.players[playerId]
		//clearInterval(interval)
		this.scene.anims.create({
            key: 'wlk_2',
            frames: this.scene.anims.generateFrameNames('wlk_2'),
			frameRate: 12,
			repeat: -1
		})
		
		var isoDestinationX = this.scene.getScreenX(destination.x, destination.y)
		var isoDestinationY = this.scene.getScreenY(destination.x, destination.y)

		player.play('wlk_2')

		//var tweens = []

		var queue = new Queue<number[]>()

		path.forEach((tile: number[]) => {
			queue.enqueue(tile)
		})

		path.shift()
		queue.removeHead()

		var p = this.runPath(path)

		this.scene.path = p
		this.scene.pathNextValue = p.next().value

		console.log('move to first tile: ' + path[0])

		var firstTileIsoX = this.scene.getScreenX(path[0][0], path[0][1])
		var firstTileIsoY = this.scene.getScreenY(path[0][0], path[0][1])

		this.scene.physics.moveTo(player, firstTileIsoX + 30, firstTileIsoY - 30, 70)

		// player.on('animationcomplete', () => {
		// 	player.body.stop()
		// 	player.setTexture('avatar')
		// 	player.setFrame(`std_2.png`)
		// })

		this.scene.tileDestination = { x: isoDestinationX, y: isoDestinationY }

		this.scene.avatarId = playerId

		// var interval = setInterval(() => {
		// 	var next = p.next()

		// 	if (next.done) {
		// 		clearInterval(interval)

		// 		player.body.stop()
        //         player.anims.stop()
        //         player.setTexture('avatar')
		// 		player.setFrame(`std_2.png`)
				
		// 		console.log('completed path!!')
		// 	}

		// 	else if (next.value !== queue.front) {
		// 		console.log('move to next tile ' + next.value)

		// 		var nextTileIsoX = this.scene.getScreenX(next.value[0], next.value[1])
		// 		var nextTileIsoY = this.scene.getScreenY(next.value[0], next.value[1])

		// 		console.log({ nextTileIsoX: nextTileIsoX, nextTileIsoY: nextTileIsoY })

		// 		this.scene.physics.moveTo(player, nextTileIsoX + 30, nextTileIsoY - 30, 70)
		// 	}
		// }, 350)


		// path.forEach((tile: any) => {
		// 	queue.enqueue(tile)
		// })

		// console.log(queue)

		// for (let element of queue) {
		// 	if (element !== queue.front) {
		// 		// if (!started) {
		// 		// 	started = true

		// 		// 	console.log(element)

		// 		// 	var isometricTileX = this.scene.getScreenX(element[0], element[1])
		// 		// 	var isometricTileY = this.scene.getScreenY(element[0], element[1])

		// 		// 	this.scene.physics.moveTo(this.players[playerId], isometricTileX + 30, isometricTileY - 30, 70)
		// 		// }

		// 		// setTimeout(() => {
		// 		// 	var isometricTileX = this.scene.getScreenX(element[0], element[1])
		// 		// 	var isometricTileY = this.scene.getScreenY(element[0], element[1])

		// 		// 	this.scene.physics.moveTo(this.players[playerId], isometricTileX + 30, isometricTileY - 30, 70)
		// 		// 	started = false
		// 		// }, 500)

		// 	}
		// }


		// 	for (var i = 1;i < path.length;) {
		// 		var nextTileX = path[i][0]
		// 		var nextTileY = path[i][1]

		// 		var nextTile = { x: nextTileX, y: nextTileY }

		// 		/* var deltaCoords = { x: player.x - nextTile.x, y: player.y - nextTile.y }

		// 		if (deltaCoords.x === 0 && deltaCoords.y > 0) {
		// 			this.scene.avatarRotation = 0
		// 			this.scene.avatar.play('wlk_0')
		// 		}

		// 		if (deltaCoords.x === 0 && deltaCoords.y < 0) {
		// 			this.scene.avatarRotation = 4
		// 			this.scene.avatar.play('wlk_4')
		// 		}

		// 		if (deltaCoords.x > 0 && deltaCoords.y === 0) {
		// 			this.scene.avatarRotation = 6
		// 			this.scene.avatar.play('wlk_6')
		// 		}

		// 		if (deltaCoords.x < 0 && deltaCoords.y === 0) {
		// 			this.scene.avatarRotation = 2

		// 			this.scene.avatar.play('wlk_2')
		// 		}

		// 		if (deltaCoords.x > 0 && deltaCoords.y < 0) {
		// 			this.scene.avatarRotation = 5
		// 			this.scene.avatar.play('wlk_5')
		// 		}

		// 		if (deltaCoords.x < 0 && deltaCoords.y > 0) {
		// 			this.scene.avatarRotation = 1
		// 			this.scene.avatar.play('wlk_1')
		// 		}

		// 		if (deltaCoords.x < 0 && deltaCoords.y < 0) {
		// 			this.scene.avatarRotation = 3
		// 			this.scene.avatar.play('wlk_3')
		// 		}

		// 		if (deltaCoords.x > 0 && deltaCoords.y > 0) {
		// 			this.scene.avatarRotation = 7
		// 			this.scene.avatar.play('wlk_7')
		// 		} */

		// 		var isoNextTileX = this.scene.getScreenX(nextTileX, nextTileX)
		// 		var isoNextTileY = this.scene.getScreenY(nextTileX, nextTileY)

		// 		console.log({ nextTileX: nextTileX, nextTileY: nextTileY, isoNextTileX: isoNextTileX, isoNextTileY: isoNextTileY })

		// 		console.log(nextTileX, nextTileY)

		// 		this.scene.physics.moveTo(this.players[playerId], this.scene.getScreenX(nextTileX, nextTileY) + 30,
		// 									this.scene.getScreenY(nextTileX, nextTileY) - 30, 70)

		// 		console.log('moved')

		// 		i++
		// 		// tweens.push({
		// 		// 	targets: this.players[playerId],
		// 		// 	x: { value: this.scene.getScreenX(nextTileX, nextTileY) + 30, duration: 450 },
		// 		// 	y: { value: this.scene.getScreenY(nextTileX, nextTileY) - 30, duration: 450 }
		// 		// });

		// 		//this.scene.physics.moveTo(this.players[playerId], isoNextTile.x, isoNextTile.y, 70)


		// 		// this.scene.add.sprite(isoNextTile.x, isoNextTile.y, 'avatar')

		// 		this.scene.avatarIsMoving = true

		// 		this.scene.avatarId = playerId
		// 	}

		// 	// this.scene.time.addEvent(
		// 	// 	{
		// 	// 		delay: 500,
		// 	// 		callback: () => {
		// 	// 			this.scene.avatarIsMoving = false
		// 	// 		}
		// 	// 	}
		// 	// )

		// 	// this.scene.tweens.timeline({
		// 	// 	tweens: tweens,
		// 	// 	onComplete: () => {
		// 	// 		this.players[playerId].anims.stop()
		// 	// 		this.players[playerId].setTexture('avatar')
		// 	// 		this.players[playerId].setFrame(`std_2.png`)
		// 	// 	}
		// 	// })

		// 	this.scene.tileDestination = { x: isoDestinationX, y: isoDestinationY }
		// }
	}

	*runPath(path: any) {
		yield* path
	}
}
