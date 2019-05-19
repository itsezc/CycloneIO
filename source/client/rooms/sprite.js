export default class RoomSprite extends Phaser.Physics.Arcade.Sprite {
	
	constructor(scene, x, y, z, texture, width, height, depth) {

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

		// super(1, 2, 0)

		this.depth = depth
		this.coordinates = new Phaser.Geom.Point(this.x, this.y - this.z)
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
		return new Phaser.Geom.Point(cartesian.x - cartesian.y, (cartesian.x + cartesian.y) / 2)
	}

	toCartesian(isometric) {
		return new Phaser.Geom.Point((isometric.y * 2 + isometric.x) / 2, (isometric.y * 2 - isometric.x) / 2)
	}

	coordsToCartesian(coordinates){
		return new Phaser.Geom.Point(coordinates.x * this.width, coordinates.y * this.height)
	}

	toCoords(cartesian) {
		return new Phaser.Geom.Point(Math.floor(cartesian.x / this.width), Math.floor(cartesian.y / this.height))
	}

	isometricToCoords(isometric) {

		var cartesian = this.toCartesian(isometric)

		console.log(cartesian)

		return this.toCoords(cartesian)

	}
}