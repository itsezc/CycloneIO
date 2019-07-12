import Room from '../rooms/room'
import RoomObjectDepth from '../../common/enums/rooms/objects/depth'
import { indexOf } from 'typescript-collections/dist/lib/arrays';

import Avatar, { TextureDictionary, Direction } from '.';

const PIXELS_PER_SECOND = 70 as const

/**
 * @param {object} scene - The room scene
 * @param {object} room - The room
 * @param {object} gameMap - The game map
 */
export default class RoomAvatar extends Phaser.GameObjects.Container {
    public x: number
    public y: number
    public isMoving: boolean
    public destination: { x: number, y: number }
    public path: any
    
    public rot: Direction
    public headRot: Direction

    private colorId: number

    private frame: number

    private avatarHead: Phaser.GameObjects.Sprite
    private avatarBody: Phaser.GameObjects.Sprite

    private look: string

    bodyTextures: TextureDictionary;
    headTextures: TextureDictionary;
    solidBodyTextures: TextureDictionary;
    solidHeadTextures: TextureDictionary;

    timer: Phaser.Time.TimerEvent;

    constructor(
        public readonly scene: Room,
        x: number, y: number, z: number
    ) {
        super(scene, x, y - z)

        this.bodyTextures = {};
        this.headTextures = {};
        this.solidBodyTextures = {};
        this.solidHeadTextures = {};

        this.look = 'hd-180-1.ch-255-66.lg-280-110.sh-305-62.ha-1012-110.hr-828-61'

        this.rot = 0
        this.headRot = 0

        this.frame = 0

        this.avatarHead = new Phaser.GameObjects.Sprite(this.scene, 0, 0, null)
        this.avatarBody = new Phaser.GameObjects.Sprite(this.scene, 0, 0, null)

        //this.scene.physics.add.existing(this)

        this.setDepth(RoomObjectDepth.FIGURE)

        this.colorId = Math.floor(Math.random() * (16777215 - 1)) + 1;

        this.isMoving = false

        this.loadGenerics()
    }

    get RenderPos() {
        return {
            x: this.scene.getScreenX(this.x, this.y),
            y: this.scene.getScreenY(this.x, this.y) - 84,
        }
    }

    private loadGenerics() {
        const { avatarImager } = this.scene;

        return avatarImager.generateGeneric(new Avatar(this.look, this.rot, this.headRot, ["std"], 'std', this.frame, true, false, "n"), false)
            .then(image => {
                console.log(image)
                this.headTextures[this.getHeadTextureKey(this.headRot, 'std', this.frame)] = this.getTextureFromImage(image)
            });
    }
    
    getTextureFromImage(image: HTMLCanvasElement): Phaser.Textures.Texture {
        const textureKey = `avatar_${Math.round(Math.random() * 10000)}`

        const texture = new Phaser.Textures.Texture(this.scene.game.textures, textureKey, image)

        return texture
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

        this.scene.physics.moveTo(this.avatarHead, initialPath.x, initialPath.y, 70)
        this.scene.physics.moveTo(this.avatarBody, initialPath.x, initialPath.y, 70)

        const rot = this.calculateRotation(coordinates.x, coordinates.y, initialPath.x, initialPath.y)

        this.rot = rot as Direction

        //this.avatarBody.play(`wlk_${this.rot}`)
        //this.avatarHead.play(`wlk_${this.rot}`)

        this.isMoving = true
    }

    calculateRotation(fromX: number, fromY: number, toX: number, toY: number) {
        let dX = toX - fromX;
        let dY = toY - fromY;

        let rotInDegrees = 4 * Math.atan2(dY, dX) / Math.PI + 2;
        return rotInDegrees;
    }

    update(delta: number) {
        this.removeAll()

        let action = ["std"];
        let gesture = "std";
        let bodyFrame = 0;
        let headFrame = 0;

        if (this.isMoving) {
            action = ["wlk"];
            bodyFrame = this.frame % 4;
        }

        //if (this.loaded) {
            this.avatarHead.texture = this.getHeadPart(this.headRot, gesture, headFrame);
            this.avatarBody.texture = this.getBodyPart(this.rot, action, bodyFrame);
            
            this.avatarHead.tint = this.colorId;
            this.avatarBody.tint = this.colorId;
        //} else {
        //    this.bodySprite.texture = BobbaEnvironment.getGame().ghostTextures.getBodyTexture(this.rot, action, bodyFrame);
        //    this.headSprite.texture = BobbaEnvironment.getGame().ghostTextures.getHeadTexture(this.headRot, gesture, headFrame);
        //}
        this.scene.add.existing(this.avatarHead)
        this.scene.add.existing(this.avatarBody)
    }

    getBodyPart(rot: number, action: string[], bodyFrame: number): Phaser.Textures.Texture | Phaser.Textures.CanvasTexture {
        return this.bodyTextures[this.getBodyTextureKey(rot, action, bodyFrame)];
    }

    getHeadPart(headRot: number, gesture: string, headFrame: number): Phaser.Textures.Texture | Phaser.Textures.CanvasTexture {
        return this.headTextures[this.getHeadTextureKey(headRot, gesture, headFrame)];
    }

    getBodyTextureKey(rot: number, action: string[], bodyFrame: number): string {
        let actionText = action[0];
        if (action.length > 1) {
            actionText += "-" + action[1];
        }
        return rot + "_" + actionText + "_" + bodyFrame;
    }
    
    getHeadTextureKey(rot: number, gesture: string, headFrame: number): string {
        return rot + "_" + gesture + "_" + headFrame;
    }

    stop() {
        // Stop the loop
        this.isMoving = false

        // Stop the player from moving
        //this.body.stop()
        //this.anims.stop()

        // Stop the walking animation
        //this.setTexture('avatar')
        //this.setFrame(`std_${this.rot}.png`)
    }

    *runPath(path: any) {
        yield* path
    }
}