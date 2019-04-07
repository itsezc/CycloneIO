import RoomScene from './rooms/scene.js'

const config = {
  type: Phaser.AUTO,
  physics: {
    default: 'arcade'
  },
  pixelArt: true,
  antialias: true,
  scale: {
    mode: Phaser.Scale.RESIZE
  },
  audio: {
    disableWebAudio: true
  },
  scene: RoomScene
}

const game = new Phaser.Game(config)
