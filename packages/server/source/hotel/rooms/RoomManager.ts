export type RoomWithPlayers = {
    roomData: any,
    players: PlayerInfo[]
    chat?: Message[]
}

import { prisma } from '../../../../storage/prisma'

export type Message = {
    from: string,
    body: string
}

export type PlayerInfo = {
    socketId: string;
    avatarData: any
}

export class RoomManager {
    private static instance: RoomManager
    private loadedRooms: RoomWithPlayers[]

    public static getInstance(): RoomManager {
        if (!RoomManager.instance){
            RoomManager.instance = new RoomManager()
        }

        return RoomManager.instance
    }

    private constructor() {
        this.loadedRooms = []
    }

    public async getRoom(id: string): Promise<RoomWithPlayers> {

        let roomWithPlayers: RoomWithPlayers = this.findRoom(id)
        console.log(roomWithPlayers)

        if(!roomWithPlayers) {
            let roomData = await prisma.room({
                id
            })

            roomWithPlayers = {
                roomData,
                players: []
            }

            this.loadedRooms.push(roomWithPlayers)
        }

        return roomWithPlayers
    }

    public removePlayer(socketId: string, roomId: string): boolean{
        const room = this.findRoom(roomId)

        if(room) {
            let playerIndex = room.players.findIndex(player => player.socketId === socketId)
            if (playerIndex){
                room.players.splice(playerIndex, 1)
                return true
            }
        }

        return false
    }

    public addPlayer(room: RoomWithPlayers, playerInfo: PlayerInfo): boolean {
        let roomWithPlayers: RoomWithPlayers = this.findRoom(room.roomData.id)

        if(!roomWithPlayers) {
            return false
        }

        roomWithPlayers.players.push(playerInfo)
        return true
    }

    public addChat(socketId: string, roomId: string): boolean {
        let room: RoomWithPlayers = this.findRoom(roomId)

        if(!room) {
            return false
        } else {
            console.log('Chat event fired')
        }

        return true
    }

    private findRoom(id: string): RoomWithPlayers {
        return this.loadedRooms.find((room: RoomWithPlayers) => room.roomData.id === id)
    }

}