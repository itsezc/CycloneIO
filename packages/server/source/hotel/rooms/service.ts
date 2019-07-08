import { Dictionary } from 'typescript-collections'

import RoomModel, { Type } from "./models/model"

export default class RoomService {
	private temporaryModel: RoomModel
	private models: Dictionary<number, RoomModel>

	public constructor(/* private readonly database: Database */) {

		this.temporaryModel = new RoomModel(0, [[0, 0, 0]], Type.STATIC, { x: 0, y: 0, z: 0 }, 2)

		this.models.setValue(this.temporaryModel.Id, this.temporaryModel)
	}

	public async getRoomModel(id: number): Promise<RoomModel> {
		// return await this.db.users.findOne({ id });
		return await this.models.getValue(id)
	}
}