

const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')

const pcars = require('./lib/index')

require('dotenv').config()
const dev = (process.env.NODE_ENV === 'development')


const start = (webContents) => {
  const sendEvent = (channel, args) => {
    if ((typeof webContents.send) === 'function') {
      webContents.send(channel, args)
    } else {
      console.log('can not send event')
    }
  }

  const listenEvent = (channel, callable) => {
    ipcMain.on(channel, function (event, arg) {
      callable(arg, event)
    })
  }

  const player = new pcars.TactPlayer(
      new pcars.BHapticsTactJsAdapter(),
      new pcars.ConfigLoader(__dirname),
      sendEvent,
      listenEvent
  )
  player.launch()
}

const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width:685,
    height:850,
    resizable:false,
    minimizable : false,
    maximizable : false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true,
    },
    frame:false,
    title:'haptic',
  })
  mainWindow.loadFile('./view/main/index.html')
      .then(() => {
        dev && mainWindow.webContents.openDevTools()
        start(mainWindow.webContents)
      })
      .catch((err) => console.error(err))
}

app.allowRendererProcessReuse = false;

app.whenReady().then(() => {
  createWindow()
  
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('close', (evt, arg) => {
  app.quit();
});
