import {
	Room,
	ADD_ROOM,
	DELETE_ROOM,
	RoomActionTypes
} from './types'

export const addRoom = (newRoom: Room): RoomActionTypes => {
	return {
		type: ADD_ROOM,
		payload: newRoom
	}
}

export const deleteRoom = (id: string): RoomActionTypes => {
	return {
		type: DELETE_ROOM,
		id
	}
}