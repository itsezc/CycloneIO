// @flow

import Phaser, { Cameras, Input } from 'phaser'

const { Scene2D } = Cameras
const { CameraManager, Camera } = Scene2D
const { Pointer } = Input

import type { Vector2D } from '../../common/types/rooms/vector'

/**
 * RoomCamera class
 * @extends {Camera}
 */
export default class RoomCamera extends Camera {

	cameras: CameraManager

	/**
	 * @param {CameraManager} cameras - The camera manager, encapsulates all the cameras
	 * @param {Vector2D} coordinates - The coordinates of the camera
	 * @param {number} width - The width of the camera
	 * @param {number} height - The height of the camera
	 */
	constructor(cameras: CameraManager, coordinates: Vector2D, width: number, height: number): void {

        super(coordinates.x, coordinates.y, width, height)

		this.cameras = cameras
		this.coordinates = coordinates
		this.width = width
		this.height = height

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