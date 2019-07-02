import Room from '../rooms/room'
import RoomObjectDepth from '../../common/enums/rooms/objects/depth'
import { indexOf } from 'typescript-collections/dist/lib/arrays';

const PIXELS_PER_SECOND = 70 as const

/**
 * @param {object} scene - The room scene
 * @param {object} room - The room
 * @param {object} gameMap - The game map
 */
export default class RoomAvatar extends Phaser.Physics.Arcade.Sprite {
    public x: number
    public y: number
    public isMoving: boolean
    public rot: number
    public destination: { x: number, y: number }
    public path: any

    constructor(
        public readonly scene: Room,
        x: number, y: number, z: number
    ) {
        super(scene, x, y - z, 'avatar')

        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)

        this.setOrigin(0, 0)
        this.setDepth(RoomObjectDepth.FIGURE)

        this.isMoving = false
    }

    get RenderPos() {
        return {
            x: this.scene.getScreenX(this.x, this.y),
            y: this.scene.getScreenY(this.x, this.y) - 84,
        }
    }

	/**
	 * Removes a player from the room
	 * @param {object} playerId - The socket Id
	 */
    removeFromRoom() {
        this.destroy()
    }

    moveToDestination(coordinates: any, path: any, destination: any) {
        path = path.shift()
        path = this.runPath(path)

        this.path = { x: path.next().value[0], y: path.next().value[0] }
        console.log(this.path)

        console.log(this.path, destination)

        const initialPath = {
            x: this.scene.getScreenX(this.path.x, this.path.x),
            y: this.scene.getScreenY(this.path.x, this.path.y) - 84
        }

        this.destination = {
            x: this.scene.getScreenX(destination.x, destination.y),
            y: this.scene.getScreenY(destination.x, destination.y) - 84
        }

        console.log(initialPath, this.destination)

        this.scene.physics.moveTo(this, initialPath.x, initialPath.y, 70)

        this.rot = this.calculateRotation(coordinates.x, coordinates.y, initialPath.x, initialPath.y)

        this.play(`wlk_${this.rot}`)

        this.isMoving = true
    }

    calculateRotation(fromX: number, fromY: number, toX: number, toY: number) {
        let dX = toX - fromX;
        let dY = toY - fromY;

        let rotInDegrees = 4 * Math.atan2(dY, dX) / Math.PI + 2;
        return rotInDegrees;
    }

    Update(delta: number) {
        if (this.isMoving) {

            // if (this.x < this.destination.x && this.rot === 6) {
            //     this.stop()
            // }

            // if (this.x > this.destination.x && this.rot === 2) {
            //     this.stop()
            // }

            // if (this.y > this.destination.y && this.rot === 4) {
            //     this.stop()
            // }

            // if (this.y < this.destination.y && this.rot === 0) {
            //     this.stop()
            // }

            // if (this.x > this.destination.x && this.y > this.destination.y && this.rot === 3) {
            //     this.stop()
            // }

            // if (this.x < this.destination.x && this.y < this.destination.y && this.rot === 7) {
            //     this.stop()
            // }

            //console.log(this.x > this.destination.x, this.y > this.destination.y)
        }
    }

    stop() {
        // Stop the loop
        this.isMoving = false

        // Stop the player from moving
        this.body.stop()
        this.anims.stop()

        // Stop the walking animation
        this.setTexture('avatar')
        this.setFrame(`std_${this.rot}.png`)
    }

    *runPath(path: any) {
        yield* path
    }
}