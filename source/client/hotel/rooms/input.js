export default class RoomInput extends Phaser.Input.InputPlugin {

    constructor(scene) {
        super(scene)
    }

    onDoubleClick(object, callback, ...args) {

        object.on('pointerdown', (pointer) => {

            if (pointer.downTime - this.tapTime < 500) {
                callback(...args)
            }

            this.tapTime = pointer.downTime
            
        })

    }
}