import Room from '../rooms/room'
import Imager from '../avatar/imager'

/*
    The main game class (Habbo)
*/
export class Engine {

    private readonly config: Object
    
    public readonly game: Phaser.Game
    public readonly avatarImager: Imager
    private readonly socket: SocketIO.Socket
    private currentRoom: Room

    constructor(parent: string, socket: SocketIO.Socket) {

        if(!document.getElementById(parent)) {
            throw `${parent} is not an element.`
        }

        this.socket = socket
        
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

        this.socket.on('setRoom', (data: any) => {
            console.log(data)
            this.gotoRoom(data)
        })

        this.socket.on('playerJoined', (data: any) => {
			this.joinPlayer(data)
        })
        
        this.socket.on('playerLeft', (data: any) => {
            this.removePlayer(data)
        })

    }

    public gotoRoom(roomWithPlayers: any) {
        // this.game.scene.remove(roomData.id)

        
        this.currentRoom = new Room(roomWithPlayers.roomData, this)        

        this.game.scene.add(roomWithPlayers.roomData.id, this.currentRoom, true)
        this.game.scene.start(roomWithPlayers.roomData.id)

        this.currentRoom.addPlayers(roomWithPlayers.players)
    }

    public joinPlayer(playerData: any){
        this.currentRoom.addPlayer(playerData)
    }

    public removePlayer(socketId: string){
        this.currentRoom.removePlayer(socketId)
    }

}

// Log game FPS
//console.log(game.loop.actualFps)