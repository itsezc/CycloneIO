import Room from '../rooms/room'
import RoomObjectDepth from '../../common/enums/rooms/objects/depth'

/**
 * @param {object} scene - The room scene
 * @param {object} room - The room
 * @param {object} gameMap - The game map
 */
export default class RoomAvatar extends Phaser.GameObjects.Sprite {
    public scene: Room
    public x: number
    public y: number
    public isMoving: boolean
    public destinationX: number
    public destinationY: number
    public path: any

    constructor(scene: Room, x: number, y: number, z: number) {
        super(scene, x, y - z, 'avatar')
        this.scene = scene

        this.scene.add.existing(this)
        this.setOrigin(0, 0)
        this.setDepth(RoomObjectDepth.FIGURE)
        this.isMoving = false
    }

    get RenderPos() {
        return {
            x: this.scene.TileToScreenCoords(this.x, this.y).x - 35,
            y: this.scene.TileToScreenCoords(this.x, this.y).y - 52,
        }
    }

	/**
	 * Removes a player from the room
	 * @param {object} playerId - The socket Id
	 */
    removeFromRoom() {
        this.destroy()
    }

    moveToDestination(path: any, destination: any) {
        this.play('wlk_2')

        this.isMoving = true

        this.path = path
        this.destinationX = this.scene.TileToScreenCoords(destination.x, destination.y).x
        this.destinationY = this.scene.TileToScreenCoords(destination.x, destination.y).y - 100

        // this.scene.time.addEvent({
        //     delay: 550,
        //     callback: () => {
        //         this.isMoving = false
        //         this.anims.stop()
        //         this.setTexture('avatar')
        //         this.setFrame(`std_2.png`)
        //     }
        // })
    }

    Update(delta: number) {
        if (this.isMoving) {

            console.log(this.x, this.y)
            console.log(this.destinationX, this.destinationY)

            const WALK_SPEED = 70 as const

            delta = delta / 1000

            if (this.destinationX > this.x) {
                this.x += WALK_SPEED * delta;
                if (this.x > this.destinationX) {
                    this.x = this.destinationX;
                }
            }

            else if (this.destinationX < this.x) {
                this.x += -WALK_SPEED * delta;
                if (this.x < this.destinationX) {
                    this.x = this.destinationX;
                }
            }

            if (this.destinationY > this.y) {
                this.y += WALK_SPEED * delta;
                if (this.y > this.destinationY) {
                    this.y = this.destinationY;
                }
            }

            else if (this.destinationY < this.y) {
                this.y -= WALK_SPEED * delta;
                if (this.y < this.destinationY) {
                    this.y = this.destinationY;
                }
            }
        }
    }
}