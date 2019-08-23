import * as Phaser from 'phaser'

import RoomScene from "../RoomScene";

export default class DebugContainer extends Phaser.GameObjects.Container {
    private readonly room: RoomScene
    private readonly fpsText: Phaser.GameObjects.Text

    private fpsCount: number

    public constructor(room: RoomScene) {
        super(room)

        this.room = room

        this.fpsText = this.displayFPSText()
        this.fpsCount = 0

        this.add(this.fpsText)
    }

    private displayFPSText(): Phaser.GameObjects.Text {
        return new Phaser.GameObjects.Text(
            this.room,
            20,
            50,
            this.getFPSString(),
            undefined
        ).setScrollFactor(0, 0)
    }

    private getFPSString(): string {
        return `Actual FPS: ${this.fpsCount}`
    }

    public setFPS(fps: number) {
        this.fpsCount = fps

        this.fpsText.text = this.getFPSString()
    }
}