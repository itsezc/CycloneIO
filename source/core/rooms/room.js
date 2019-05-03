// @flow
import RoomModel from './model'

export default class Room {
    +id: number
    +model: RoomModel
    +floorThickness: number
    +wallThickness: number
    +wallHeight: number
    +hideWalls: boolean;

    constructor(id: number, model: RoomModel, floorThickness: number, wallThickness: number, wallHeight: number, hideWalls: boolean) {
        this.id = id
        this.model = model
        this.floorThickness = floorThickness
        this.wallThickness = wallThickness
        this.wallHeight = wallHeight
        this.hideWalls = hideWalls
    }
}
