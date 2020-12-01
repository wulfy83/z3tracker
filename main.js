const { app, BrowserWindow } = require('electron');

function createWindow () {
    const win = new BrowserWindow({
        show: false,
        resizable: false,
        width: 1920,
        height: 1040,
        minWidth: 1920,
        minHeight: 1040,
    });
    win.setMenu(null);
    win.loadFile('tracker/index.html');
    win.webContents.openDevTools({ detach: true });
    win.show();
}

app.commandLine.appendSwitch("disable-gpu")
app.on('ready', createWindow);
