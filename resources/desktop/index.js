const Config = require('../../config.json')
const {
    app,
	Menu,
    BrowserWindow,
    session
} = require('electron')

let window

let createWindow = () => {
    window = new BrowserWindow({
        width: 1280,
        height: 720,
		frame: false,
        title: Config.hotel.name
    })
	Menu.setApplicationMenu(null)
    window.maximize()
    window.loadURL(Config.hotel.url[0] + '/client')

    window.on('close', () => {
        window = null
    })

}

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if (window === null) {
        createWindow()
    }
})

app.on('ready', () => createWindow())
