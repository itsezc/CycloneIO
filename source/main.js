import { Pixi } from './Pixi.js'

import { Room } from './room.js'

const { Application, Container } = Pixi

const app = new Application()

const viewport = new Viewport.Viewport({
    screenWidth : window.innerWidth,
    screenHeight : window.innerHeight,
    worldWidth : 1000,
    worldHeight : 1000,
    interaction : app.renderer.plugins.interaction
})

viewport.drag()

const room = new Room(
    'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx\r\nxjjjjjjjjjjjjjx0000xxxxxxxxxx\r\nxjjjjjjjjjjjjjx0000xxxxxxxxxx\r\nxjjjjjjjjjjjjjx0000xxxxxxxxxx\r\nxjjjjjjjjjjjjjx0000xxxxxxxxxx\r\nxjjjjjjjjjjjjjx0000xxxxxxxxxx\r\nxjjjjjjjjjjjjjx0000xxxxxxxxxx\r\nxjjjjjjjjjjjjjx0000xxxxxxxxxx\r\nxjjjjjjjjjjjjjx0000xxxxxxxxxx\r\nxxxxxxxxxxxxiix0000xxxxxxxxxx\r\nxxxxxxxxxxxxhhx0000xxxxxxxxxx\r\nxxxxxxxxxxxxggx0000xxxxxxxxxx\r\nxxxxxxxxxxxxffx0000xxxxxxxxxx\r\nxxxxxxxxxxxxeex0000xxxxxxxxxx\r\nxeeeeeeeeeeeeex0000xxxxxxxxxx\r\neeeeeeeeeeeeeex0000xxxxxxxxxx\r\nxeeeeeeeeeeeeex0000xxxxxxxxxx\r\nxeeeeeeeeeeeeex0000xxxxxxxxxx\r\nxeeeeeeeeeeeeex0000xxxxxxxxxx\r\nxeeeeeeeeeeeeex0000xxxxxxxxxx\r\nxeeeeeeeeeeeeex0000xxxxxxxxxx\r\nxeeeeeeeeeeeeex0000xxxxxxxxxx\r\nxeeeeeeeeeeeeex0000xxxxxxxxxx\r\nxeeeeeeeeeeeeex0000xxxxxxxxxx\r\nxxxxxxxxxxxxddx00000000000000\r\nxxxxxxxxxxxxccx00000000000000\r\nxxxxxxxxxxxxbbx00000000000000\r\nxxxxxxxxxxxxaax00000000000000\r\nxaaaaaaaaaaaaax00000000000000\r\nxaaaaaaaaaaaaax00000000000000\r\nxaaaaaaaaaaaaax00000000000000\r\nxaaaaaaaaaaaaax00000000000000\r\nxaaaaaaaaaaaaax00000000000000\r\nxaaaaaaaaaaaaax00000000000000\r\nxaaaaaaaaaaaaax00000000000000\r\nxaaaaaaaaaaaaax00000000000000\r\nxaaaaaaaaaaaaax00000000000000\r\nxaaaaaaaaaaaaax00000000000000\r\nxxxxxxxxxxxx99x0000xxxxxxxxxx\r\nxxxxxxxxxxxx88x0000xxxxxxxxxx\r\nxxxxxxxxxxxx77x0000xxxxxxxxxx\r\nxxxxxxxxxxxx66x0000xxxxxxxxxx\r\nxxxxxxxxxxxx55x0000xxxxxxxxxx\r\nxxxxxxxxxxxx44x0000xxxxxxxxxx\r\nx4444444444444x0000xxxxxxxxxx\r\nx4444444444444x0000xxxxxxxxxx\r\nx4444444444444x0000xxxxxxxxxx\r\nx4444444444444x0000xxxxxxxxxx\r\nx4444444444444x0000xxxxxxxxxx\r\nx4444444444444x0000xxxxxxxxxx\r\nx4444444444444x0000xxxxxxxxxx\r\nx4444444444444x0000xxxxxxxxxx\r\nx4444444444444x0000xxxxxxxxxx\r\nx4444444444444x0000xxxxxxxxxx\r\nxxxxxxxxxxxx33x0000xxxxxxxxxx\r\nxxxxxxxxxxxx22x0000xxxxxxxxxx\r\nxxxxxxxxxxxx11x0000xxxxxxxxxx\r\nxxxxxxxxxxxx00x0000xxxxxxxxxx\r\nx000000000000000000xxxxxxxxxx\r\nx000000000000000000xxxxxxxxxx\r\nx000000000000000000xxxxxxxxxx\r\nx000000000000000000xxxxxxxxxx\r\nx000000000000000000xxxxxxxxxx\r\nx000000000000000000xxxxxxxxxx\r\nx000000000000000000xxxxxxxxxx\r\nx000000000000000000xxxxxxxxxx\r\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\r\nxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
)
viewport.addChild(room.wallContainer)
viewport.addChild(room.tileContainer)


app.stage.addChild(viewport)


app.view.width = window.innerWidth
app.view.height = window.innerHeight

document.body.appendChild(app.view)



