import Room from '../rooms/room'
import Imager from '../avatar/imager'

/*
    The main game class (Habbo)
*/
export class Engine {

    private readonly config: Object
    
    public readonly game: Phaser.Game
    public readonly avatarImager: Imager

    constructor(parent: string) {

        if(!document.getElementById(parent)) {
            throw `${parent} is not an element.`
        }
        
        this.avatarImager = new Imager(this)

        this.avatarImager.initialize().then(() => {
            console.log('Avatar Imager initialized')
        })
 
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
        let room = new Room(roomData, this)
        this.game.scene.add(roomData.id, room, true)
        this.game.scene.start(roomData.id)
    }

}

// Log game FPS
//console.log(game.loop.actualFps)