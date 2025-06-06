import { contextBridge, ipcRenderer } from "electron";
import { MongoloreConfig } from "shared/models/mongolore-config";

declare global {
  interface Window {
    App: typeof API;
  }
}

const API = {
  settings: {
    getConfigFile: () =>
      ipcRenderer.invoke("settings:getConfigFile") as Promise<
        MongoloreConfig | undefined
      >,
    createConfigFileIfNotExists: () =>
      ipcRenderer.invoke("settings:createConfigFileIfNotExists"),
  },
};

contextBridge.exposeInMainWorld("App", API);
