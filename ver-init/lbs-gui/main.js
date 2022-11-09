// Modules to control application life and create native browser window
const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');

/* Set ENV */
let env = 'dev';
// let env = 'production';
/* process.env.NODE_ENV = 'production'; */

const binFileName = process.platform == 'win32' ? 'native.exe' : 'native';
const jarFileName = 'code-0.0.1-SNAPSHOT.jar';
ipcMain.handle('bin-file', () => path.join(__dirname, 'bin', binFileName));
ipcMain.handle('jar-file', () => path.join(__dirname, 'java', jarFileName));
ipcMain.on('app:quit', () => {
    BrowserWindow.getFocusedWindow().close();
});
ipcMain.on('app:window-minimize', () => {
    BrowserWindow.getFocusedWindow().minimize();
});
ipcMain.on('app:window-maximize', () => {
    BrowserWindow.getFocusedWindow().maximize();
});
ipcMain.on('app:window-unmaximize', () => {
    BrowserWindow.getFocusedWindow().unmaximize();
});

ipcMain.handle('dialog-save-xlsx', async (event, defaultPath) => {
    const result = await dialog.showSaveDialog({
        defaultPath: defaultPath,
        filters: [{ name: '电子表格', extensions: ['xlsx'] }],
        properties: ['createDirectory'],
    });
    return result;
});

function createWindow() {
    // Create the browser window.
    const mainWindow = new BrowserWindow({
        frame: process.platform == 'win32' ? false : true,
        titleBarStyle: process.platform == 'win32' ? undefined : 'hidden',
        width: 1400,
        minWidth: 720,
        height: 900,
        minHeight: 480,
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            webSecurity: false,
            enableBlinkFeatures: 'CSSColorSchemeUARendering',
        },
    });

    if (env === 'production') {
        // mainWindow.loadURL('http://localhost:3000/');
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    } else {
        mainWindow.loadURL('http://localhost:8080/');
        /* mainWindow.loadURL('http://localhost:3000/'); */
    }

    return mainWindow;
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
    const window = createWindow();

    window.on('maximize', () => {
        window.webContents.send('window-maximize');
    });
    window.on('unmaximize', () => {
        window.webContents.send('window-unmaximize');
    });

    app.on('activate', function () {
        // On macOS it's common to re-create a window in the app when the
        // dock icon is clicked and there are no other windows open.
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on('window-all-closed', () => {
    app.quit();
});
