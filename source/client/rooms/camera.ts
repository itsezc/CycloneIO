import { Vector2D } from '../../common/types/rooms/vector'
import IGameObject from '../games/object';

/**
 * RoomCamera class
 * @extends {Camera}
 */
export default class RoomCamera extends Phaser.Cameras.Scene2D.Camera implements IGameObject {

	private cameras: Phaser.Cameras.Scene2D.CameraManager
	private coordinates: Vector2D

	public isScrolling: boolean = false

	/**
	 * @param {CameraManager} cameras - The camera manager, encapsulates all the cameras
	 * @param {Vector2D} coordinates - The coordinates of the camera
	 * @param {number} width - The width of the camera
	 * @param {number} height - The height of the camera
	 */
	constructor(cameras: Phaser.Cameras.Scene2D.CameraManager, coordinates: Vector2D, width: number, height: number) {

        super(coordinates.x, coordinates.y, width, height)

		this.cameras = cameras
		this.coordinates = coordinates
	}

	/**
	 * Creates the new camera
	 */
	public create(): void {

		this.cameras.remove(this.cameras.main)
		this.cameras.addExisting(this, true)

		this.centerOn(this.midPoint.x / this.width, this.midPoint.y / this.height)
	}
	
	/**
	 * @param {Pointer} pointer - Encapsulates both mouse and touch input
	 */
	public scroll(pointer: Phaser.Input.Pointer): void {

		this.scrollX += (pointer.downX - pointer.x) / this.zoom
        pointer.downX = pointer.x

        this.scrollY += (pointer.downY - pointer.y) / this.zoom
        pointer.downY = pointer.y

		this.isScrolling = true
	}
}