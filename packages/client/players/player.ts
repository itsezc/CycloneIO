import Room from '../rooms/room'
import RoomObjectDepth from '../../common/enums/rooms/objects/depth'

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
		console.log(playerX, playerY)
		var xLocation = this.scene.getScreenX(playerX, playerY)
		var yLocation = this.scene.getScreenY(playerX, playerY)

		this.players[playerId] = this.scene.physics.add.sprite(xLocation + 32, yLocation - 28, 'avatar').setDepth(RoomObjectDepth.FIGURE)

		console.log(xLocation, yLocation)
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
		var isoDestinationX = this.scene.getScreenX(destination.x, destination.y)
		var isoDestinationY = this.scene.getScreenY(destination.x, destination.y)

		this.players[playerId].play('wlk_2')

		var tweens = []
		for (var i = 1;i < path.length;i++) {
			var nextTileX = path[i][0]
			var nextTileY = path[i][1]

			var nextTile = { x: nextTileX, y: nextTileY }

			/* var deltaCoords = { x: player.x - nextTile.x, y: player.y - nextTile.y }

			if (deltaCoords.x === 0 && deltaCoords.y > 0) {
				this.scene.avatarRotation = 0
				this.scene.avatar.play('wlk_0')
			}

			if (deltaCoords.x === 0 && deltaCoords.y < 0) {
				this.scene.avatarRotation = 4
				this.scene.avatar.play('wlk_4')
			}

			if (deltaCoords.x > 0 && deltaCoords.y === 0) {
				this.scene.avatarRotation = 6
				this.scene.avatar.play('wlk_6')
			}

			if (deltaCoords.x < 0 && deltaCoords.y === 0) {
				this.scene.avatarRotation = 2

				this.scene.avatar.play('wlk_2')
			}

			if (deltaCoords.x > 0 && deltaCoords.y < 0) {
				this.scene.avatarRotation = 5
				this.scene.avatar.play('wlk_5')
			}

			if (deltaCoords.x < 0 && deltaCoords.y > 0) {
				this.scene.avatarRotation = 1
				this.scene.avatar.play('wlk_1')
			}

			if (deltaCoords.x < 0 && deltaCoords.y < 0) {
				this.scene.avatarRotation = 3
				this.scene.avatar.play('wlk_3')
			}

			if (deltaCoords.x > 0 && deltaCoords.y > 0) {
				this.scene.avatarRotation = 7
				this.scene.avatar.play('wlk_7')
			} */

			var isoNextTileX = this.scene.getScreenX(nextTileX, nextTileX)
			var isoNextTileY = this.scene.getScreenY(nextTileX, nextTileY)

			console.log({ nextTileX: nextTileX, nextTileY: nextTileY, isoNextTileX: isoNextTileX, isoNextTileY: isoNextTileY })

			var isoNextTile = { x: isoNextTileX + 64, y: isoNextTileY - 28 }

			console.log(isoNextTile)

			if (!this.scene.avatarIsMoving) {
				tweens.push({
					targets: this.players[playerId],
					x: { value: this.scene.getScreenX(nextTileX, nextTileY) + 30, duration: 450 },
					y: { value: this.scene.getScreenY(nextTileX, nextTileY) - 30, duration: 450 }
				});

				//this.scene.physics.moveTo(this.players[playerId], isoNextTile.x, isoNextTile.y, 70)
			}

			// this.scene.add.sprite(isoNextTile.x, isoNextTile.y, 'avatar')

			// this.scene.avatarIsMoving = true

			// this.scene.avatarId = playerId

			this.scene.time.addEvent(
				{
					delay: 500,
					callback: () => {
						this.scene.avatarIsMoving = false
					}
				}
			)
		}

		this.scene.tweens.timeline({
			tweens: tweens,
			onComplete: () => {
				this.players[playerId].anims.stop()
				this.players[playerId].setTexture('avatar')
				this.players[playerId].setFrame(`std_2.png`)
			}
		})

		this.scene.tileDestination = { x: isoDestinationX, y: isoDestinationY }

	}
}
