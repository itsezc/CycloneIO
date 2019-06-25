import Room from '../rooms/room'
import RoomObjectDepth from '../../common/enums/rooms/objects/depth'

/**
 * @param {object} scene - The room scene
 * @param {object} room - The room
 * @param {object} gameMap - The game map
 */
export default class RoomPlayer {
	private scene: Room
	private players: Phaser.GameObjects.Group

	constructor(scene: Room) {
		this.scene = scene;
		this.players = this.scene.add.group();
	}

	/**
	 * Creates and places a player
	 * @param {object} player - The player to add
	 * TODO: player walking animation
	 */
	addPlayerToRoom(player: any) {
		console.log(player)
		var xLocation = this.scene.getScreenX(player.x, player.y)
		var yLocation = this.scene.getScreenY(player.x, player.y)

		this.players.create(
			xLocation + 32,
			yLocation - 28,
			'avatar',
		).setData({ playerId: player.playerId }).setDepth(RoomObjectDepth.FIGURE)
	}

	/**
	 * Removes a player from the room
	 * @param {object} playerId - The socket Id
	 */
	removePlayerFromRoom(playerId: number) {
		const player = this.players.getChildren().find(p => p.getData('playerId') === playerId)

		if (player) {
			player.destroy()
		}
	}
}
