import Environment from '../../environment'
import Constants from '../../network/constants.json'

export default class RoomModel {
	constructor(id, map) {
		this.id = id
		this.map = map

		this.init()
	}

	init() {
		const currentRoom = Environment.instance.roomManager.roomByID(this.id)

		this.map.forEach((tiles, row) => {
			tiles.forEach((tile, index) => {
				const x = (row * 32) + (index * 32)
				const y = ((row * 32) - (index * 32)) / 2

				if (tile === this.squareType.TILE) {
					Environment.instance.server.socketIO.to(this.id).emit(Constants.common.actions.room.NEW_TILE, x, y, currentRoom.properties.wall.thickness, this.leftEdge(tiles, index), this.bottomEdge(row, index))
				}
			})
		})
	}

	leftEdge(tiles, index) {
		const leftTile = tiles[index - 1]

		if (leftTile !== this.squareType.TILE) {
			return true
		} else {
			return false
		}
	}

	bottomEdge(row, index) {
		const bottomTiles = this.map[row + 1]

		if (bottomTiles !== undefined) {
			const bottomTile = bottomTiles[index]

			if (bottomTile !== this.squareType.TILE) {
				return true
			} else {
				return false
			}
		} else {
			return true
		}
	}

	get squareType() {
		return {
			BLANK: 0,
			TILE: 1,
		}
	}
}
