// @flow

import Phaser, { Cameras, Input } from 'phaser'

const { Scene2D } = Cameras
const { CameraManager, Camera } = Scene2D
const { Pointer } = Input

/**
 * RoomCamera class
 * @extends {Camera}
 */
export default class RoomCamera extends Camera {

	cameras: CameraManager

	/**
	 * @param {CameraManager} cameras - The camera manager, encapsulates all the cameras
	 * @param {number} x - The x position of the camera
	 * @param {number} y - The y position of the camera
	 * @param {number} width - The width of the camera
	 * @param {number} height - The height of the camera
	 */
	constructor(cameras: CameraManager, x: number, y: number, width: number, height: number): void {

        super(x, y, width, height)

		this.cameras = cameras
		this.create()
	}

	/**
	 * Creates the new camera
	 */
	create(): void {

		this.cameras.remove(this.cameras.main)
		this.cameras.addExisting(this, true)

		this.centerOn(this.midPoint.x / this.width, this.midPoint.y / this.height)
	}
	
	/**
	 * @param {Pointer} pointer - Encapsulates both mouse and touch input
	 */
	scroll(pointer: Pointer): void {

		this.scrollX += (pointer.downX - pointer.x) / this.zoom
        pointer.downX = pointer.x

        this.scrollY += (pointer.downY - pointer.y) / this.zoom
        pointer.downY = pointer.y

		this.isScrolling = true
    }
}