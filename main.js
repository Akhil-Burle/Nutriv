const { app, BrowserWindow } = require("electron");

// const server = require("./server");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 700,
    icon: "public/img/favicon.ico",
    webPreferences: {
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL("https://nutriv-akhil.herokuapp.com/");
  mainWindow.on("closed", function () {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

app.on("resize", function (e, x, y) {
  mainWindow.setSize(x, y);
});

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
