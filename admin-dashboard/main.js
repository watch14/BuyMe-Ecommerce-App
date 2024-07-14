const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  const startUrl = url.format({
    pathname: path.join(
      __dirname,
      "dist",
      "coreui-free-angular-admin-template",
      "browser",
      "index.html"
    ),
    protocol: "file:",
    slashes: true,
  });

  console.log(`Loading URL: ${startUrl}`); // Debug the path
  mainWindow.loadURL(startUrl);

  mainWindow.webContents.on("did-finish-load", () => {
    console.log("Page Loaded"); // Ensure the page is loading
  });

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  if (mainWindow === null) {
    createWindow();
  }
});
