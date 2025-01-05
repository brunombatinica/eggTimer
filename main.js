// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  // Create the browser window
  const mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    alwaysOnTop: true,
    webPreferences: {
      // This setting allows using certain Node APIs in the renderer
      nodeIntegration: true,
    },
    icon: path.join(__dirname, 'icon.png'), // optional if you have an icon file
  });

  // Load your local index.html (the egg timer UI)
  mainWindow.loadFile(path.join(__dirname, '/src/index.html'));

  //hide the menu bar
  mainWindow.setMenuBarVisibility(false);

  // Optional: Open dev tools for debugging
  // mainWindow.webContents.openDevTools();
}

// Called when Electron has finished initialization
app.whenReady().then(() => {
  createWindow();

  // On macOS, recreate a window when the dock icon is clicked, if no windows are open
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed (except on macOS)
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});