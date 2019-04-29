import RoomScene from './rooms/scene.js'

const config = {
    type: Phaser.WEBGL,
    scene: RoomScene,
    disableContextMenu: true,
    banner: false,
    render: {
        pixelArt: true
    },
    physics: {
        default: 'arcade'
    },
    scale: {
        // width: window.innerWidth,
        // height: window.innerHeight,
        // resolution: window.devicePixelRatio,
        mode: Phaser.Sc
        autoRound: true,
    },
}

const game = new Phaser.Game(config)

// window.addEventListener('resize', () => {
    
//     game.scale.resize(window.innerWidth, window.innerHeight);

// }, false);
