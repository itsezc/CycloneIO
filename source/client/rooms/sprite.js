export default class RoomSprite extends Phaser.Physics.Arcade.Sprite {
	
	constructor(scene, x, y, z, width, height, texture) {
		super(scene, x, y - z, texture)

		this.scene = scene
		this.x = x
		this.y = y
		this.z = z
		this.texture = texture

		if (width !== undefined) {
			this.width = width
		}

		if (height !== undefined) {
			this.height = height
		}

		this.create()
	}

	create() {
		this.setTexture(this.texture)
		this.scene.add.existing(this)
	}

	get coordinates() {
		return new Phaser.Geom.Point(this.x, this.y - this.z)
	}

	get cartesian() {
		return new Phaser.Geom.Point(this.coordinates.x * this.width, this.coordinates.y * this.height)
	}

	get isometric() {
		return new Phaser.Geom.Point(this.coordinates.x - this.coordinates.y, (this.coordinates.x + this.coordinates.y) / 2)
	}
}