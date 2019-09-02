export const ADD_ROOM = 'ADD_ROOM'
export const DELETE_ROOM = 'DELETE_ROOM'

export interface Room {
	id: string,
	name: string,
	description: string,
	currentUsers: number,
	maxUsers: number,
	owner: string
}

interface AddRoomAction {
	type: typeof ADD_ROOM,
	payload: Room
}

interface DeleteRoomAction {
	type: typeof DELETE_ROOM,
	id: string
}

export type NavigatorActionTypes = AddRoomAction | DeleteRoomAction

export interface NavigatorState {
	rooms: Room[]
}