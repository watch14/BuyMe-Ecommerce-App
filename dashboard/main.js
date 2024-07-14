const { app, BrowserWindow, ipcMain } = require("electron");
const url = require("url");
const path = require("path");

let mainWindow;
let passwordWindow;

function createPasswordWindow() {
  passwordWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false, // Needed for using require in the renderer process
    },
    resizable: false,
    frame: true,
  });

  passwordWindow.loadFile(path.join(__dirname, "password.html"));
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, `/dist/dashboard/browser/index.html`),
      protocol: "file:",
      slashes: true,
    })
  );
  mainWindow.webContents.openDevTools();
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createPasswordWindow);

ipcMain.on("login-success", () => {
  passwordWindow.close();
  createMainWindow();
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createMainWindow();
});
