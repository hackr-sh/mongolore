import { contextBridge, ipcRenderer } from "electron";

declare global {
  interface Window {
    App: typeof API;
  }
}

const API = {
  settings: {
    getConfigFile: () => ipcRenderer.invoke("settings:getConfigFile"),
    createConfigFileIfNotExists: () =>
      ipcRenderer.invoke("settings:createConfigFileIfNotExists"),
  },
};

contextBridge.exposeInMainWorld("App", API);
