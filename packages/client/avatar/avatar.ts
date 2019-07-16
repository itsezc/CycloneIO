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
    private totalTimeRunning: number = 0

    private isGhost: boolean;
    
    public rot: Direction
    public headRot: Direction

    private colorId: number

    private frame: number

    private avatarHead: Phaser.GameObjects.Sprite
    private avatarBody: Phaser.GameObjects.Sprite

    private look: string

    headImage: HTMLCanvasElement;
    userInfoImage: HTMLCanvasElement;

    timer: Phaser.Time.TimerEvent;

    constructor(
        public readonly scene: Room,
        x: number, y: number, z: number,
        private readonly id: number
    ) {
        super(scene, x, y - z)

        this.isGhost = false

        this.look = 'ca-1815-92.sh-290-62.hd-180-1009.ch-262-64.ha-3763-63.lg-280-1193.hr-831-54'

        this.rot = 2
        this.headRot = 2

        this.frame = 0

        this.avatarHead = new Phaser.GameObjects.Sprite(this.scene, 0, 0, null)
        this.avatarBody = new Phaser.GameObjects.Sprite(this.scene, 0, 0, null)

        //this.scene.physics.add.existing(this)

        this.setDepth(RoomObjectDepth.FIGURE)

        this.colorId = Math.floor(Math.random() * (16777215 - 1)) + 1;

        this.isMoving = false

        this.loadGenerics()       

        /*const sprite = this.scene.add.sprite(0, 0, 'tile')

        this.add(sprite)

        scene.add.existing(this)*/
    }

    get RenderPos() {
        // let x = this.scene.getScreenX(this.x, this.y)
        // let y = this.scene.getScreenY(this.x, this.y)

        // 16 = tile height
        // 32 = tile width

        let x = this.scene.getScreenX(this.x, this.y) + 32
        let y = this.scene.getScreenY(this.x, this.y) - 32

        return {
            x,
            y /*- (16 * (y + 1)) */ , //Prob we'll have to change this when implementing movement
        }
    }

    private loadGenerics() {
        const { avatarImager } = this.scene.engine;

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

    async _loadUniqueBodyTexture(direction: Direction, action: string[], frame: number): Promise<void> {
        const { avatarImager } = this.scene.engine;

        const image = await avatarImager.generateGeneric(new Avatar(this.scene.engine, this.look, direction, direction, action, "std", frame, false, true, "n"), this.isGhost);
        
        const key = this.getBodyTextureKey(direction, action, frame);

        this.addTexture(key, image)
    }

    async _loadUniqueHeadTexture(headDirection: Direction, gesture: string, frame: number): Promise<void> {
        const { avatarImager } = this.scene.engine;

        const image = await avatarImager.generateGeneric(new Avatar(this.scene.engine, this.look, headDirection, headDirection, ["std"], gesture, frame, true, false, "n"), this.isGhost);
        const key = this.getHeadTextureKey(headDirection, gesture, frame);

        this.addTexture(key, image)
    }

    async _loadChatHeadImage(): Promise<void> {
        const { avatarImager } = this.scene.engine;

        const canvas = await avatarImager.generateGeneric(new Avatar(this.scene.engine, this.look, 2, 2, ["std"], "std", 0, true, false, "d"), this.isGhost);
        
        this.headImage = canvas;
    }

    async _loadUserInfoImage(): Promise<void> {
        const { avatarImager } = this.scene.engine;

        const canvas = await avatarImager.generateGeneric(new Avatar(this.scene.engine, this.look, 4, 4, ["std"], "std", 0, false, false, "n"), this.isGhost);
        
        this.userInfoImage = canvas;
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

    addTexture(key: string, image: HTMLCanvasElement) {
        if (!this.scene.game.textures.exists(key)) {
            this.scene.game.textures.addCanvas(key, image)
        }

        /*const shtKey = this.getSilhouetteKey(key)

        if (!this.scene.game.textures.exists(shtKey)) {
            const shtImage = this.generateSilhouette(image, 255, 255, 255, 170)

            if (shtImage instanceof HTMLCanvasElement) {
                this.scene.game.textures.addCanvas(shtKey, shtImage)
            } else if (shtImage instanceof HTMLImageElement) {
                this.scene.game.textures.addImage(shtKey, shtImage)
            }
        }*/
    }

    generateSilhouette(img: HTMLImageElement | HTMLCanvasElement, r: number, g: number, b: number, a: number): HTMLCanvasElement | HTMLImageElement {
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
                    imageData.data[inpos - 1] = a; //A
                    imageData.data[inpos - 2] = b; //B
                    imageData.data[inpos - 3] = g; //G
                    imageData.data[inpos - 4] = r; //R
                }
            }
        }
        c.putImageData(imageData, 0, 0);
        return element;
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
        let action = ["std"];
        let gesture = "std";
        let bodyFrame = 0;
        let headFrame = 0;

        if (this.isMoving) {
            action = ["wlk"];
            bodyFrame = this.frame % 4;
        }

        const bodyKey = this.getBodyTextureKey(this.rot, action, bodyFrame)
        const headKey = this.getHeadTextureKey(this.headRot, gesture, headFrame)

        if(this.scene.game.textures.exists(bodyKey) && this.scene.game.textures.exists(headKey)){
            this.avatarBody.setTexture(bodyKey)

            if (!this.exists(this.avatarBody)) {
                this.add(this.avatarBody)

                this.avatarBody.setInteractive()
            }
        
            this.avatarHead.setTexture(headKey)

            if (!this.exists(this.avatarHead)) {
                this.add(this.avatarHead)
            }
        }
        
        /*
            const shtBodyKey = this.getSilhouetteKey(bodyKey)
            const shtHeadKey = this.getSilhouetteKey(headKey)

            if (this.scene.game.textures.exists(shtBodyKey)) {
                this.avatarBody.setTexture(shtBodyKey)
                
                if (!this.exists(this.avatarBody)) {
                    this.add(this.avatarBody)
                }
            }

            if (this.scene.game.textures.exists(shtHeadKey)) {
                this.avatarHead.setTexture(shtHeadKey)

                if (!this.exists(this.avatarHead)) {
                    this.add(this.avatarHead)
                }
            }
        */
    }

    getBodyTextureKey(rot: number, action: string[], bodyFrame: number): string {
        let actionText = action[0];
        if (action.length > 1) {
            actionText += "-" + action[1];
        }

        return `body=${this.look}*${rot}_${actionText}_${bodyFrame}`
    }
    
    getHeadTextureKey(rot: number, gesture: string, headFrame: number): string {
        return `head=${this.look}*${rot}_${gesture}_${headFrame}`
    }

    getSilhouetteKey(key: string): string {
        return `sht/${key}`
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