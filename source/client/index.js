import Config from '../../config.json'
import RoomScene from './rooms/scene.js'

const config = {
    title: 'Cyclone',
    url: '',
    version: Config.version,
    banner: false,
    // banner: {
    //     text: '#FFFFFF',
    //     background: [
    //         '#FFA54C',
    //         '#FFA38C',
    //         '#F6A089',
    //         '#F29888'
    //     ],
    //     hidePhaser: true
    // },
    resolution: window.devicePixelRatio,
    type: Phaser.WEBGL,
    pixelArt: true,
    antialias: true,
    scale: {
        //mode: Phaser.Scale.NONE,
        width: window.innerWidth,
        height: window.innerHeight,
        //autoRound: true,
    },
    physics: {
        default: 'arcade'
    },
    // audio: {
    //     disableWebAudio: true
    // },
    scene: RoomScene
}

const game = new Phaser.Game(config)

// FPS
console.log('FPS', game.loop.actualFps)

// Resize
window.addEventListener('resize', () => {
    
    game.scale.resize(window.innerWidth, window.innerHeight);

}, false);
