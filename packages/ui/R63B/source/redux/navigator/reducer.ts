import { 
	NavigatorState,
	NavigatorActionTypes,
	ADD_ROOM,
	DELETE_ROOM
} from './types'

const initialState: NavigatorState = {
	rooms: []
}

export default function navigatorReducer(
	state = initialState,
	action: NavigatorActionTypes
): NavigatorState {

	switch (action.type) {

		case ADD_ROOM:
			return {
				rooms: [...state.rooms, action.payload]
			}

		case DELETE_ROOM:
			return {
				rooms: state.rooms.filter(
					room => room.id !== action.id
				)
			}

		default:
			return state
	}

}