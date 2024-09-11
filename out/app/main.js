"use strict";
const path = require("path");
const electron = require("electron");
const electronUpdater = require("electron-updater");
const log = require("electron-log");
const nodeChildProcess = require("child_process");
const url = require("url");
class MenuBuilder {
  mainWindow;
  constructor(mainWindow2) {
    this.mainWindow = mainWindow2;
  }
  buildMenu() {
    if (process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true") {
      this.setupDevelopmentEnvironment();
    }
    const template = process.platform === "darwin" ? this.buildDarwinTemplate() : this.buildDefaultTemplate();
    const menu = electron.Menu.buildFromTemplate(template);
    electron.Menu.setApplicationMenu(menu);
    return menu;
  }
  setupDevelopmentEnvironment() {
    this.mainWindow.webContents.on("context-menu", (_, props) => {
      const { x, y } = props;
      electron.Menu.buildFromTemplate([
        {
          label: "Inspect element",
          click: () => {
            this.mainWindow.webContents.inspectElement(x, y);
          }
        }
      ]).popup({ window: this.mainWindow });
    });
  }
  buildDarwinTemplate() {
    const subMenuAbout = {
      label: "Electron",
      submenu: [
        {
          label: "About ElectronReact",
          selector: "orderFrontStandardAboutPanel:"
        },
        { type: "separator" },
        { label: "Services", submenu: [] },
        { type: "separator" },
        {
          label: "Hide ElectronReact",
          accelerator: "Command+H",
          selector: "hide:"
        },
        {
          label: "Hide Others",
          accelerator: "Command+Shift+H",
          selector: "hideOtherApplications:"
        },
        { label: "Show All", selector: "unhideAllApplications:" },
        { type: "separator" },
        {
          label: "Quit",
          accelerator: "Command+Q",
          click: () => {
            electron.app.quit();
          }
        }
      ]
    };
    const subMenuEdit = {
      label: "Edit",
      submenu: [
        { label: "Undo", accelerator: "Command+Z", selector: "undo:" },
        {
          label: "Redo",
          accelerator: "Shift+Command+Z",
          selector: "redo:"
        },
        { type: "separator" },
        { label: "Cut", accelerator: "Command+X", selector: "cut:" },
        { label: "Copy", accelerator: "Command+C", selector: "copy:" },
        {
          label: "Paste",
          accelerator: "Command+V",
          selector: "paste:"
        },
        {
          label: "Select All",
          accelerator: "Command+A",
          selector: "selectAll:"
        }
      ]
    };
    const subMenuViewDev = {
      label: "View",
      submenu: [
        {
          label: "Reload",
          accelerator: "Command+R",
          click: () => {
            this.mainWindow.webContents.reload();
          }
        },
        {
          label: "Toggle Full Screen",
          accelerator: "Ctrl+Command+F",
          click: () => {
            this.mainWindow.setFullScreen(
              !this.mainWindow.isFullScreen()
            );
          }
        },
        {
          label: "Toggle Developer Tools",
          accelerator: "Alt+Command+I",
          click: () => {
            this.mainWindow.webContents.toggleDevTools();
          }
        }
      ]
    };
    const subMenuViewProd = {
      label: "View",
      submenu: [
        {
          label: "Toggle Full Screen",
          accelerator: "Ctrl+Command+F",
          click: () => {
            this.mainWindow.setFullScreen(
              !this.mainWindow.isFullScreen()
            );
          }
        }
      ]
    };
    const subMenuWindow = {
      label: "Window",
      submenu: [
        {
          label: "Minimize",
          accelerator: "Command+M",
          selector: "performMiniaturize:"
        },
        {
          label: "Close",
          accelerator: "Command+W",
          selector: "performClose:"
        },
        { type: "separator" },
        { label: "Bring All to Front", selector: "arrangeInFront:" }
      ]
    };
    const subMenuHelp = {
      label: "Help",
      submenu: [
        {
          label: "Learn More",
          click() {
            electron.shell.openExternal("https://electronjs.org");
          }
        },
        {
          label: "Documentation",
          click() {
            electron.shell.openExternal(
              "https://github.com/electron/electron/tree/main/docs#readme"
            );
          }
        },
        {
          label: "Community Discussions",
          click() {
            electron.shell.openExternal(
              "https://www.electronjs.org/community"
            );
          }
        },
        {
          label: "Search Issues",
          click() {
            electron.shell.openExternal(
              "https://github.com/electron/electron/issues"
            );
          }
        }
      ]
    };
    const subMenuView = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true" ? subMenuViewDev : subMenuViewProd;
    return [
      subMenuAbout,
      subMenuEdit,
      subMenuView,
      subMenuWindow,
      subMenuHelp
    ];
  }
  buildDefaultTemplate() {
    const templateDefault = [
      {
        label: "&File",
        submenu: [
          {
            label: "&Open",
            accelerator: "Ctrl+O"
          },
          {
            label: "&Close",
            accelerator: "Ctrl+W",
            click: () => {
              this.mainWindow.close();
            }
          }
        ]
      },
      {
        label: "&View",
        submenu: process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true" ? [
          {
            label: "&Reload",
            accelerator: "Ctrl+R",
            click: () => {
              this.mainWindow.webContents.reload();
            }
          },
          {
            label: "Toggle &Full Screen",
            accelerator: "F11",
            click: () => {
              this.mainWindow.setFullScreen(
                !this.mainWindow.isFullScreen()
              );
            }
          },
          {
            label: "Toggle &Developer Tools",
            accelerator: "Alt+Ctrl+I",
            click: () => {
              this.mainWindow.webContents.toggleDevTools();
            }
          }
        ] : [
          {
            label: "Toggle &Full Screen",
            accelerator: "F11",
            click: () => {
              this.mainWindow.setFullScreen(
                !this.mainWindow.isFullScreen()
              );
            }
          }
        ]
      },
      {
        label: "Help",
        submenu: [
          {
            label: "Learn More",
            click() {
              electron.shell.openExternal("https://electronjs.org");
            }
          },
          {
            label: "Documentation",
            click() {
              electron.shell.openExternal(
                "https://github.com/electron/electron/tree/main/docs#readme"
              );
            }
          },
          {
            label: "Community Discussions",
            click() {
              electron.shell.openExternal(
                "https://www.electronjs.org/community"
              );
            }
          },
          {
            label: "Search Issues",
            click() {
              electron.shell.openExternal(
                "https://github.com/electron/electron/issues"
              );
            }
          }
        ]
      }
    ];
    return templateDefault;
  }
}
function resolveHtmlPath(htmlFileName) {
  if (process.env.NODE_ENV === "development") {
    const port = process.env.PORT || 5173;
    const url$1 = new url.URL(`http://localhost:${port}`);
    url$1.pathname = htmlFileName;
    return url$1.href;
  }
  return `file://${path.resolve(__dirname, "./renderer/", htmlFileName)}`;
}
class AppUpdater {
  constructor() {
    log.transports.file.level = "info";
    electronUpdater.autoUpdater.logger = log;
    electronUpdater.autoUpdater.checkForUpdatesAndNotify();
  }
}
let mainWindow = null;
if (process.env.NODE_ENV === "production") {
  const sourceMapSupport = require("source-map-support");
  sourceMapSupport.install();
}
const isDebug = process.env.NODE_ENV === "development" || process.env.DEBUG_PROD === "true";
if (isDebug) {
  require("electron-debug")();
}
const installExtensions = async () => {
  const installer = require("electron-devtools-installer");
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ["REACT_DEVELOPER_TOOLS"];
  return installer.default(
    extensions.map((name) => installer[name]),
    forceDownload
  ).catch(console.log);
};
const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }
  const RESOURCES_PATH = electron.app.isPackaged ? path.join(process.resourcesPath, "assets") : path.join(__dirname, "../../assets");
  const getAssetPath = (...paths) => {
    return path.join(RESOURCES_PATH, ...paths);
  };
  mainWindow = new electron.BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    // transparent: true,
    // resizable: true,
    icon: getAssetPath("icon.png"),
    webPreferences: {
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js")
    }
  });
  mainWindow.loadURL(resolveHtmlPath("index.html"));
  mainWindow.on("ready-to-show", () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
  });
  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    electron.shell.openExternal(edata.url);
    return { action: "deny" };
  });
  new AppUpdater();
};
electron.ipcMain.on("ipc-example", async (event, arg) => {
  const msgTemplate = (pingPong) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply("ipc-example", msgTemplate("pong"));
});
function checkWL() {
  try {
    nodeChildProcess.execSync("wolframscript -version");
    return true;
  } catch (error) {
    return false;
  }
}
function startWL() {
  const wlProc = nodeChildProcess.spawn("wolframscript", [
    "-noinit",
    "-noprompt",
    "-rawterm",
    "-script",
    `${electron.app.isPackaged ? "./../../" : "."}'/wl/deploy.wls'`
  ]);
  console.log(`WL pid: ${wlProc.pid}`);
  wlProc.stdout.on("data", (data) => {
    const dataStr = data.toString().trim();
    console.log(`WL stdout: ${dataStr}`);
    if (dataStr === `"Type 'exit' to end process:"`) {
      mainWindow?.webContents.send("wl-status", 0);
    }
  });
  wlProc.stderr.on("data", (err) => {
    console.log(`WL stderr: ${err}`);
  });
  wlProc.on("exit", (code) => {
    console.log(`WL exit code: ${code}`);
    electron.dialog.showErrorBox(
      "wolframscript has quit unexpectedly",
      "Will attempt to restart the process."
    );
    mainWindow?.webContents.send("wl-status", code);
    startWL();
  });
}
if (!checkWL()) {
  electron.dialog.showErrorBox(
    "wolframscript not found",
    "Please install it and try again."
  );
  electron.app.exit(1);
}
electron.ipcMain.on("start-wl", startWL);
electron.ipcMain.handle(
  "change-zoom-level",
  (_event, we) => {
    if (we.ctrlKey) {
      const zoomFactor = mainWindow?.webContents.getZoomFactor() ?? 1;
      const delta = we.deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Math.max(0.1, zoomFactor + delta);
      console.log("Zoom:", `${newZoom * 100}%`);
      mainWindow?.webContents.setZoomFactor(newZoom);
    }
  }
);
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
  }
});
electron.app.whenReady().then(() => {
  createWindow();
  electron.app.on("activate", () => {
    if (mainWindow === null) createWindow();
  });
}).catch(console.log);
