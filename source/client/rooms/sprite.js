export default class RoomSprite extends Phaser.Physics.Arcade.Sprite {
	
	constructor(scene, x, y, z, texture, width, height) {

		super(scene, x, y - z, texture)

		this.scene = scene
		this.x = x
		this.y = y
		this.z = z

		if (width !== undefined) {
			this.width = width
		}

		if (height !== undefined) {
			this.height = height
		}

		this
	}

	create() {
		this.setPosition(this.isometric.x, this.isometric.y)
	}

	get coordinates() {
		return new Phaser.Geom.Point(this.x, this.y - this.z)
	}

	get cartesian() {
		return new Phaser.Geom.Point(this.coordinates.x * this.width, this.coordinates.y * this.height)
	}

	get isometric() {
		return new Phaser.Geom.Point(this.cartesian.x - this.cartesian.y, (this.cartesian.x + this.cartesian.y) / 2)
	}
}