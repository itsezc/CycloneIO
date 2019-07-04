import Room from '../rooms/room'
import RoomObjectDepth from '../../common/enums/rooms/objects/depth';
import Vector from '../../common/types/rooms/vector';

export default interface IGameObject {
	create(): void
}

export class GameObject extends Phaser.GameObjects.GameObject implements IGameObject {
	public readonly _scene: Room
	public readonly type: string

	private readonly coordinates: Vector
	private readonly depth: RoomObjectDepth

	private readonly texture?: string
	private readonly frame?: string

	private image!: Phaser.GameObjects.Image
	private sprite!: Phaser.GameObjects.Sprite

	constructor(scene: Room, type: string, coordinates: Vector, depth: RoomObjectDepth, texture?: string, frame?: string) {
		super(scene, type)

		this._scene = scene
		this.type = type

		this.coordinates = coordinates
		this.depth = depth

		this.texture = texture
		this.frame = frame
	}

	create() {
		switch (this.type) {
			case 'image':
				{
					if (this.texture) {
						this.image = new Phaser.GameObjects.Image(this._scene, this.coordinates.x,
							this.coordinates.y - this.coordinates.z, this.texture, this.frame)

						this.image.setDepth(this.depth)
						this.image.setTexture(this.texture, this.frame)
					}
				}

			case 'sprite':
				{
					if (this.texture) {
						this.sprite = new Phaser.GameObjects.Sprite(this._scene, this.coordinates.x,
							this.coordinates.y - this.coordinates.z, this.texture, this.frame)

						this.sprite.setDepth(this.depth)
						this.sprite.setTexture(this.texture, this.frame)
					}
				}

			case 'isobox':
				{

				}
		}

		this._scene.add.existing(this)
	}
}