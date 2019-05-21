import Phaser, { Physics } from 'phaser'

const { Arcade } = Physics
const { Sprite } = Arcade

export default class RoomSprite extends Sprite {

	constructor(scene, x, y, z, texture, depth) {

		super(scene, x, y - z, texture)

		this.scene = scene
		this.x = x
		this.y = y
		this.z = z
		this.texture = texture
		this.width = 32
		this.height = 32
		this.depth = depth
		this.coordinates = { x, y, z }

	}

	create() {
		
		this.scene.add.existing(this)

		this.cartesian = this.coordsToCartesian(this.coordinates)
		this.isometric = this.toIsometric(this.cartesian)

		this.setPosition(this.isometric.x, this.isometric.y)
		this.setDepth(this.depth)
		this.setTexture(this.texture)
		
	}

	toIsometric(cartesian) {
		return { x: cartesian.x - cartesian.y, y: (cartesian.x + cartesian.y) / 2, z: cartesian.z }
	}

	toCartesian(isometric) {
		return { x: (isometric.y * 2 + isometric.x) / 2, y: (isometric.y * 2 - isometric.x) / 2, z: isometric.z }
	}

	coordsToCartesian(coordinates){
		return { x: coordinates.x * this.width, y: coordinates.y * this.height, z: coordinates.z }
	}

	toCoords(cartesian) {
		return { x: Math.floor(cartesian.x / this.width), y: Math.floor(cartesian.y / this.height), z: cartesian.z }
	}
}