// // @flow

// import RoomSprite from './sprite'
// import Room from './room'

// /**
//  * RoomFurniture Class
//  * @extends {RoomSprite}
//  */
// export default class RoomFurniture extends RoomSprite {

//     scene: Room
//     x: number
//     y: number
//     z: number
//     texture: string

//     /**
//      * @param {Room} scene - The room scene
//      * @param {number} x - The x coordinate of the furniture 
//      * @param {number} y - The y coordinate of the furniture
//      * @param {number} z - The z coordinate of the furniture
//      * @param {string} texture - The furniture texture
//      */
//     constructor(scene: Room, x: number, y: number, z: number, texture: string): void {

//         super(scene, x, y, z, texture, 3)

//         this.scene = scene
//         this.x = x
//         this.y = y
//         this.z = z
//         this.texture = texture

//         this.preload()
//     }

//     /**
//      * Preloads the furniture
//      */
//     preload(): void {
//         this.scene.load.setPath(`web-build/furniture/${this.texture}/`)
//         this.scene.load.atlas(this.texture, `${this.texture}.png`, `${this.texture}.json`)
//         this.scene.load.start()

//         this.scene.load.once('complete', () => {
//             this.create()
//         })
//     }

//     /**
//      * Creates the furniture
//      */
//     create(): void { 

//         super.create()

//         // this.scene.anims.create({
//         //     key: this.texture.key,
//         //     frames: this.scene.anims.generateFrameNumbers(this.texture.key, { start: 1, end: this.texture.frameTotal }),
//         //     frameRate: 13,
//         //     repeat: -1,
//         //     yoyo: true
//         // })

//         //this.alpha = 0.5

//         this.setPosition(this.x, this.y - this.height / 2.8)
//         this.setInteractive({ pixelPerfect: true })

//         // this.scene.onDoubleClick(this, () => {
//         //     this.animate()
//         // })

//         this.on('pointerover', () => {
//             this.rotate()
//         })
//     }

//     /**
//      * Animates the furniture
//      */
//     animate(): void {

//         if (!this.anims.isPlaying) {
//             this.anims.play(this.texture) 
//         }

//         else {
//             this.anims.remove(this.texture)
//             this.setFrame(0)
//         }
//     }

//     /** 
//      * Rotates the furniture 
//      */
//     rotate(): void {
//         // this.scene.tweens.add({
//         //     targets: this,
//         //     y: -6,
//         //     duration: 100,
//         //     yoyo: true,
//         // })

//         this.flipX = !this.flipX
//     }
// }