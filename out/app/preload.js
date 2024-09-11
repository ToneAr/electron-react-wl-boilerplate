"use strict";
const electron = require("electron");
const electronHandler = {
  changeZoom: (we) => electron.ipcRenderer.invoke("change-zoom-level", we),
  ipcRenderer: {
    sendMessage(channel, ...args) {
      electron.ipcRenderer.send(channel, ...args);
    },
    on(channel, func) {
      const subscription = (_event, ...args) => func(...args);
      electron.ipcRenderer.on(channel, subscription);
      return () => {
        electron.ipcRenderer.removeListener(channel, subscription);
      };
    },
    once(channel, func) {
      electron.ipcRenderer.once(channel, (_event, ...args) => func(...args));
    }
  }
};
electron.contextBridge.exposeInMainWorld("electron", electronHandler);
