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
    private FPS = 24
    private FPS_TIME_MS = 60 / this.FPS

    public x: number
    public y: number
    public isMoving: boolean
    public destination: { x: number, y: number }
    public path: any

    private frameCount: number
    private totalTimeRunning: number

    private isGhost: boolean;
    
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

    headImage: HTMLCanvasElement;
    userInfoImage: HTMLCanvasElement;

    loaded: boolean

    timer: Phaser.Time.TimerEvent;

    constructor(
        public readonly scene: Room,
        x: number, y: number, z: number,
        private readonly id: number
    ) {
        super(scene, x, y - z)

        /*this.bodyTextures = {};
        this.headTextures = {};
        this.solidBodyTextures = {};
        this.solidHeadTextures = {};

        this.isGhost = false

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

        this.scene.avatarImager.initialize().then(() => {
            this.loadGenerics().then(() => {
                console.log('avatar initialized')
                this.loaded = true
            })
        })*/

        const sprite = this.scene.add.sprite(0, 0, 'tile')

        this.add(sprite)

        scene.add.existing(this)
    }

    get RenderPos() {
        return {
            x: this.scene.getScreenX(this.x, this.y),
            y: this.scene.getScreenY(this.x, this.y) - 84,
        }
    }

    private loadGenerics() {
        const { avatarImager } = this.scene;

        const promises: Promise<void>[] = [];

        for (let i = 0; i <= 7; i++) {
            promises.push(this._loadUniqueHeadTexture(i as Direction, "std", 0));
            promises.push(this._loadUniqueHeadTexture(i as Direction, "eyb", 0));

            promises.push(this._loadUniqueBodyTexture(i as Direction, ["std"], 0));
            for (let j = 0; j <= 3; j++) {
                promises.push(this._loadUniqueBodyTexture(i as Direction, ["wlk"], j));
                promises.push(this._loadUniqueBodyTexture(i as Direction, ["wlk", "wav"], j));
            }
            for (let j = 0; j <= 1; j++) {
                promises.push(this._loadUniqueBodyTexture(i as Direction, ["wav"], j));
                promises.push(this._loadUniqueHeadTexture(i as Direction, "spk", j));
            }
        }

        for (let i = 0; i <= 7; i = i + 2) {
            promises.push(this._loadUniqueBodyTexture(i as Direction, ["sit"], 0));
            for (let j = 0; j <= 1; j++) {
                promises.push(this._loadUniqueBodyTexture(i as Direction, ["sit", "wav"], j));
            }
        }

        promises.push(this._loadChatHeadImage());
        promises.push(this._loadUserInfoImage());

        this.colorId = avatarImager.getChatColor(this.look);

        return Promise.all(promises);
    }

    _loadUniqueBodyTexture(direction: Direction, action: string[], frame: number): Promise<void> {
        const { avatarImager } = this.scene;

        return avatarImager.generateGeneric(new Avatar(this.look, direction, direction, action, "std", frame, false, true, "n"), this.isGhost)
            .then(image => {
                const key = this.getBodyTextureKey(direction, action, frame)

                this.bodyTextures[key] = this.getTextureFromImage(image, key);
                this.solidBodyTextures[key] = this.getTextureFromImage(this.generateSilhouette(image, 255, 255, 255), key);
            });
    }

    _loadUniqueHeadTexture(headDirection: Direction, gesture: string, frame: number): Promise<void> {
        const { avatarImager } = this.scene;

        return avatarImager.generateGeneric(new Avatar(this.look, headDirection, headDirection, ["std"], gesture, frame, true, false, "n"), this.isGhost)
            .then(image => {
                const key = this.getHeadTextureKey(headDirection, gesture, frame)
                
                this.headTextures[key] = this.getTextureFromImage(image, key);
                this.solidHeadTextures[key] = this.getTextureFromImage(this.generateSilhouette(image, 255, 255, 255), key);
            });
    }

    _loadChatHeadImage(): Promise<void> {
        const { avatarImager } = this.scene;

        return avatarImager.generateGeneric(new Avatar(this.look, 2, 2, ["std"], "std", 0, true, false, "d"), this.isGhost)
            .then(canvas => {
                this.headImage = canvas;
            });
    }

    _loadUserInfoImage(): Promise<void> {
        const { avatarImager } = this.scene;

        return avatarImager.generateGeneric(new Avatar(this.look, 4, 4, ["std"], "std", 0, false, false, "n"), this.isGhost)
            .then(canvas => {
                this.userInfoImage = canvas;
            });
    }
    
    getTextureFromImage(image: HTMLCanvasElement | HTMLImageElement, key: string): Phaser.Textures.Texture {
        const texture = new Phaser.Textures.Texture(this.scene.game.textures, key, image)

        return texture
    }

    generateSilhouette(img: HTMLImageElement | HTMLCanvasElement, r: number, g: number, b: number): HTMLCanvasElement | HTMLImageElement {
        const element = document.createElement('canvas');
        const c = element.getContext("2d");
        const { width, height } = img;
    
        if (c == null || width === 0 || height === 0) {
            return img;
        }
    
        element.width = width;
        element.height = height;
    
        c.drawImage(img, 0, 0);
        const imageData = c.getImageData(0, 0, width, height);
    
        for (let y = 0; y < height; y++) {
            let inpos = y * width * 4;
            for (let x = 0; x < width; x++) {
                //const pr = imageData.data[inpos++];
                //const pg = imageData.data[inpos++];
                //const pb = imageData.data[inpos++];
                inpos += 3; //////
    
                const pa = imageData.data[inpos++];
                if (pa !== 0) {
                    imageData.data[inpos - 1] = 255; //A
                    imageData.data[inpos - 2] = b; //B
                    imageData.data[inpos - 3] = g; //G
                    imageData.data[inpos - 4] = r; //R
                }
            }
        }
        c.putImageData(imageData, 0, 0);
        return element;
    };

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
        this.totalTimeRunning += 1

        let frameCount = Math.round(this.totalTimeRunning / this.FPS_TIME_MS)

        if (this.frameCount != frameCount)
        {
            this.frameCount = frameCount
            this.updateAvatarView()
        }
    }

    updateAvatarView() {
        this.removeAll()

        let action = ["std"];
        let gesture = "std";
        let bodyFrame = 0;
        let headFrame = 0;

        if (this.isMoving) {
            action = ["wlk"];
            bodyFrame = this.frame % 4;
        }

        if (this.loaded) {
            this.avatarBody.texture =  this.getBodyPart(this.rot, action, bodyFrame)
            this.avatarHead.texture = this.getHeadPart(this.headRot, gesture, headFrame);
        } else {
            //this.avatarBody.texture = this.getBodyPart(this.rot, action, bodyFrame);
            //this.avatarHead.texture = this.getHeadPart(this.headRot, gesture, headFrame);
        }

        if(this.loaded) {
            this.add(this.avatarHead)
            this.add(this.avatarBody)
        }
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