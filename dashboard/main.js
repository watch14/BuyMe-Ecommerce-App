const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");
require("dotenv").config({ path: path.join(__dirname, ".env") }); // Load environment variables from .env file

const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

const storedHashedPassword = hashPassword(process.env.PASSWORD);

// Debugging: Log the loaded and hashed password
if (!process.env.PASSWORD) {
  console.error("ERROR: PASSWORD environment variable is not defined.");
} else {
  console.log("Loaded Password:", process.env.PASSWORD);
  console.log("Hashed Password:", storedHashedPassword);
}

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
    `file://${path.join(__dirname, "/dist/dashboard/browser/index.html")}`
  );

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createPasswordWindow);

ipcMain.on("check-password", (event, inputPassword) => {
  console.log("Input Password:", inputPassword); // Debugging line
  if (
    storedHashedPassword &&
    hashPassword(inputPassword) === storedHashedPassword
  ) {
    createMainWindow();
    passwordWindow.close();
  } else {
    event.sender.send("login-failed");
  }
});

app.on("window-all-closed", function () {
  if (process.platform !== "darwin") app.quit();
});

app.on("activate", function () {
  if (mainWindow === null) createMainWindow();
});
