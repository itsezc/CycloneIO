import IInputManager from "../../input/IInputManager";
import RoomScene from "../RoomScene";

export default class RoomInputManager implements IInputManager {
    private room: RoomScene

    public constructor(room: RoomScene) {
        this.room = room
    }

    public registerInputEvents(): void {
        this.room.input.on('pointermove', (pointer: Phaser.Input.Pointer): void => {
            if (pointer.primaryDown) {
                const x = (pointer.downX - pointer.x) / this.room.cameras.main.zoom
                pointer.downX = pointer.x

                const y = (pointer.downY - pointer.y) / this.room.cameras.main.zoom
                pointer.downY = pointer.y

                this.room.roomCameraManager.scroll(x, y)
            }
        }, this)
    }
}