import * as Phaser from 'phaser'

import RoomScene from "../RoomScene"
import TilesContainer from "./tiles/TilesContainer"
import DebugContainer from "./DebugContainer";
import Habbo from "../../Habbo";

export default class RoomContainer extends Phaser.GameObjects.Container {
	public readonly debugContainer: DebugContainer
	public readonly tilesContainer: TilesContainer

	public constructor(room: RoomScene) {
		super(room)

		if (Habbo.DEBUG) {
			this.debugContainer = new DebugContainer(room)
		}

		this.tilesContainer = new TilesContainer(room)

		this.addContainers()
	}

	private addContainers(): void {
		this.add(this.tilesContainer)

		if (Habbo.DEBUG) {
			this.add(this.debugContainer)
		}
	}
}