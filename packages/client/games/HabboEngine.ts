import Room from '../rooms/Room'
import Imager from '../avatar/imager'
import {RoomWithPlayers} from "../../common/types/client/rooms/IRoom";

/*
    The main game class (Habbo)
*/
export class HabboEngine {

	private readonly config: Record<string, any>
    
	public readonly game: Phaser.Game
	public readonly avatarImager: Imager
	public readonly socket: SocketIO.Socket
	private currentRoom: Room
	// currentUser here

	public constructor(parent: string, socket: SocketIO.Socket) {

		if(!document.getElementById(parent)) {
			throw `${parent} is not an element.`
		}

		this.socket = socket
        
		this.avatarImager = new Imager(this)

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

	public async init(): Promise<void> {
		await this.avatarImager.initialize()

		console.log('Avatar Imager initialized')

		this.socket.on('setRoom', (data: RoomWithPlayers) => {
			this.gotoRoom(data)
		})

		this.socket.on('playerJoined', (data: any) => {
			this.joinPlayer(data)
		})

		this.socket.on('playerLeft', (data: any) => {
			this.removePlayer(data)
		})

		this.socket.on('playerMoved', (data: any) => {
			this.movePlayer(data)
		})

		console.log('Events loaded')

	}

	public gotoRoom(roomWithPlayers: RoomWithPlayers) {
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

	public movePlayer(data: any) {
		this.currentRoom.movePlayer(data)
	}

}

// Log game FPS
//console.log(game.loop.actualFps)
