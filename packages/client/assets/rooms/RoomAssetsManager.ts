import IAssetsManager from "../IAssetsManager"
import IRoom from "../../rooms/IRoom";

export default class RoomAssetsManager extends IAssetsManager {

	public constructor(room: IRoom){
		super(room)
	}

	public assets(): void {
	    this.image('tile_hover', 'room/tile_hover.png')
	}
}
