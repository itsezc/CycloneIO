import Room from '../rooms/room'

/* const config = {
    resolution: window.devicePixelRatio,
    type: Phaser.WEBGL,
    scene: new Room(0), // To change this on the navigator
    parent: 'game',
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade'
    },
    disableContextMenu: false,
    scale: {
        mode: Phaser.Scale.ScaleModes.RESIZE,
        width: window.innerWidth,
        height: window.innerHeight,
    }
} */

/*
    The main game class (Habbo)
*/
/* const game = new Phaser.Game(config)
 */
export class Game {

    private readonly config: Object
    private readonly game: Phaser.Game

    constructor(parent: string) {

        if(!document.getElementById(parent)) {
            throw `${parent} is not an element.`
        }

        this.config = {
            resolution: window.devicePixelRatio,
            type: Phaser.WEBGL,
            parent,
            render: {
                pixelArt: true
            },
            physics: {
                default: 'arcade'
            },
            disableContextMenu: false,
            scale: {
                mode: Phaser.Scale.ScaleModes.RESIZE,
                width: window.innerWidth,
                height: window.innerHeight,
            }
        }

        this.game = new Phaser.Game(this.config)

    }

    public gotoRoom(roomData: any) {
        let room = new Room(roomData)
        this.game.scene.add(roomData.id, room, true)
        this.game.scene.start(roomData.id)
    }
}

// Log game FPS
//console.log(game.loop.actualFps)