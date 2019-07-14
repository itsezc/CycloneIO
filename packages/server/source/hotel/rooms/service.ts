import Room, { RoomType, AccessType } from './room';
import RoomModel, { ModelType } from './models/model'

export default class RoomService {
	private readonly temporaryModel: RoomModel
	private readonly temporaryRoom: Room

	private readonly models: Map<number, RoomModel>
	private readonly rooms: Map<number, Room>

	public constructor() {

		this.temporaryModel = new RoomModel(0, [[0, 0, 0]], ModelType.STATIC, { x: 0, y: 0, z: 0 }, 2)
		this.models.set(this.temporaryModel.Id, this.temporaryModel)

		this.temporaryRoom = new Room(0, RoomType.PUBLIC, 0, 0, 'test room', 'testing', ['test'], AccessType.OPEN)
		this.rooms.set(this.temporaryRoom.Id, this.temporaryRoom)
	}
}