import * as Phaser from 'phaser';

export default class Room extends Phaser.Scene {
    private readonly id: number

	constructor(id: number) {
        super({})

        this.id = id
    }
}