import * as Phaser from 'phaser'

export default class RoomCameraManager {
    camera: Phaser.Cameras.Scene2D.Camera

    public constructor(camera: Phaser.Cameras.Scene2D.Camera) {
        this.camera = camera
    }

    public scroll(x: number, y: number): void {
        this.camera.scrollX += x
        this.camera.scrollY += y
    }

    public centerCamera(x: number, y: number): void {
        this.camera.centerOn(x, y)
    }
}