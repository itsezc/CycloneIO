import Room from '../rooms/room'
import { RoomModelDepth } from '../../common/enums/rooms/models/depth';
import { Vector } from '../../common/types/rooms/vector';

export interface IGameObject
{
	create(): void
}

export default class GameObject extends Phaser.GameObjects.GameObject implements IGameObject
{
	public readonly scene: Room
	public readonly type: string

	private readonly coordinates: Vector
	private readonly depth: RoomModelDepth
	
	private readonly texture?: string
	private readonly frame?: string

	private image!: Phaser.GameObjects.Image
	private sprite!: Phaser.GameObjects.Sprite

	constructor(scene: Room, type: string, coordinates: Vector, depth: RoomModelDepth, texture?: string, frame?: string)
	{
		super(scene, type)

		this.scene = scene
		this.type = type

		this.coordinates = coordinates
		this.depth = depth

		this.texture = texture
		this.frame = frame
	}

	create()
	{
		switch (this.type)
		{
			case 'image':
				{
					if (this.texture) 
					{
						this.image = new Phaser.GameObjects.Image(this.scene, this.coordinates.x,
							this.coordinates.y - this.coordinates.z, this.texture, this.frame)

						this.image.setDepth(this.depth)
						this.image.setTexture(this.texture, this.frame)
					}
				}

			case 'sprite':
				{
					if (this.texture) 
					{
						this.sprite = new Phaser.GameObjects.Sprite(this.scene, this.coordinates.x,
							this.coordinates.y - this.coordinates.z, this.texture, this.frame)

						this.sprite.setDepth(this.depth)
						this.sprite.setTexture(this.texture, this.frame)
					}
				}

			case 'isobox':
				{

				}
		}

		this.scene.add.existing(this)
	}
}