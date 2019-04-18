import Environment from '../../environment'
import Constants from '../../network/constants.json'

import Room from './room'

export default class RoomModel {

	constructor(id, map) {
		this.id = id
		this.map = map

		this.init()
	}

	init() {
		const currentRoom = Environment.instance.roomManager.roomByID(this.id)

		this.map.forEach((squares, row) => {

			squares.forEach((square, index) => {

				if (square !== this.squareType.BLANK) {

					let x = (row * 32) + (index * 32)
					let y = ((row * 32) - (index * 32)) / 2
					let z = square[1] * 32 || 0
					let height = square[1]

					Environment.instance.server.socketIO.to(this.id).emit(Constants.common.actions.room.NEW_TILE,
						x, y, z, currentRoom.properties.floor.thickness,
						this.leftEdge(height, squares, index), this.bottomEdge(height, row, index))
				}
			})
		})
	}

	leftEdge(height, squares, index) {
		let leftSquare = squares[index - 1]

		if (height) {

			if (leftSquare) {

				let leftHeight = leftSquare[1]

				if (leftHeight) {

					if (leftHeight !== height) {
						return true
					}

				} else {
					return true
				}

			} else {
				return true
			}

		} else if (leftSquare !== this.squareType.TILE) {
			return true
		}
	}

	bottomEdge(height, row, index) {
		let bottomSquares = this.map[row + 1]

		if (height) {
			if (bottomSquares) {
				const bottomHeight = bottomSquares[1]

				if (bottomHeight && bottomHeight !== height) {
					return true
				}

			} else {
				return true
			}

		} else {

			if (bottomSquares) {
				let bottomSquare = bottomSquares[index]

				if (bottomSquare !== this.squareType.TILE) {
					return true
				}

			} else {
				return true
			}
		}
	}

	get squareType() {
		return {
			BLANK: 0,
			TILE: 1,
		}
	}
}
