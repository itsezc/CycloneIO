import { Vector2D } from '../../common/types/rooms/vector'
import IGameObject from '../games/object';

/**
 * RoomCamera class
 * @extends {Camera}
 */
export default class RoomCamera extends Phaser.Cameras.Scene2D.Camera implements IGameObject
{

	private _cameras: Phaser.Cameras.Scene2D.CameraManager

	public isScrolling: boolean = false

	/**
	 * @param {CameraManager} cameras - The camera manager, encapsulates all the cameras
	 * @param {Vector2D} coordinates - The coordinates points of the camera
	 * @param {number} width - The camera width
	 * @param {number} height - The camera height
	 */
	constructor(cameras: Phaser.Cameras.Scene2D.CameraManager, coordinates: Vector2D, width: number, height: number)
	{
		super(coordinates.x, coordinates.y, width, height)

		this._cameras = cameras
	}

	/**
	 * Creates the camera
	 */
	public create(): void
	{
		this._cameras.remove(this._cameras.main)
		this._cameras.addExisting(this, true)

		this.centerOn(this.midPoint.x / this.width, this.midPoint.y / this.height)
	}

	/**
	 * @param {Pointer} pointer - Encapsulates both mouse and touch input
	 */
	public scroll(pointer: Phaser.Input.Pointer): void
	{
		this.scrollX += (pointer.downX - pointer.x) / this.zoom
		pointer.downX = pointer.x

		this.scrollY += (pointer.downY - pointer.y) / this.zoom
		pointer.downY = pointer.y

		this.isScrolling = true
	}
}