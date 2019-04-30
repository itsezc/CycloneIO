// import RoomScene from './rooms/scene.js'

// const config = {
//     resolution: window.devicePixelRatio,
//     type: Phaser.WEBGL,
//     scene: RoomScene,
//     disableContextMenu: false,
//     banner: false,
//     render: {
//         pixelArt: true
//     },
//     physics: {
//         default: 'arcade'
//     },
//     scale: {
//         width: window.innerWidth,
//         height: window.innerHeight,
//         mode: Phaser.Scale.ScaleModes.FIT
//     }
// }

// const game = new Phaser.Game(config)

var config = {
    type: Phaser.WEBGL,
    scale: {
        mode: Phaser.Scale.FIT,
        width: 1360,
        height: 697,
        zoom: 2
    },
    scene: {
        preload: preload,
        create: create
    }
}

var game = new Phaser.Game(config)

function preload() {
    this.load.path = 'web-build/'
    this.load.svg('tile', 'room/tile.svg')
}

function create() {
    console.log(window.innerHeight)
    this.camera = this.cameras.main

    this.camera.centerOn(
        this.camera.midPoint.x / window.innerWidth,
        this.camera.midPoint.y / window.innerHeight
    )

    this.input.on('pointermove', pointer => {
        if (pointer.primaryDown) {
            this.camera.scrollX += pointer.downX - pointer.x
            pointer.downX = pointer.x

            this.camera.scrollY += pointer.downY - pointer.y
            pointer.downY = pointer.y
        }
    })

    // this.input.on('pointerdown', function () {

    //     var currentZoom = this.scale.zoom;

    //     if (currentZoom < 6)
    //     {
    //         this.scale.setZoom(currentZoom + 1);
    //     }

    // }, this);


    let polygon = new Phaser.Geom.Polygon([0, 0, 32, 16, 64, 0, 32, -16])

    var graphics = this.add
        .graphics()
        .fillStyle(0x8e8e5e)
        .fillPoints(polygon.points)
}
