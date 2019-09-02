import {
	Room,
	ADD_ROOM,
	DELETE_ROOM,
	NavigatorActionTypes
} from './types'

export const addRoom = (newRoom: Room): NavigatorActionTypes => {
	return {
		type: ADD_ROOM,
		payload: newRoom
	}
}

export const deleteRoom = (id: string): NavigatorActionTypes => {
	return {
		type: DELETE_ROOM,
		id
	}
}