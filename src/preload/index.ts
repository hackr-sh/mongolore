import { contextBridge, ipcRenderer } from 'electron'
import type { MongoloreConfig } from 'shared/models/mongolore-config'

declare global {
  interface Window {
    App: typeof API
  }
}

const API = {
  settings: {
    getConfigFile: () =>
      ipcRenderer.invoke('settings:getConfigFile') as Promise<
        MongoloreConfig | undefined
      >,
    createConfigFileIfNotExists: () =>
      ipcRenderer.invoke('settings:createConfigFileIfNotExists'),
  },
  safeStorage: {
    isEncryptionAvailable: () =>
      ipcRenderer.invoke(
        'safeStorage:isEncryptionAvailable'
      ) as Promise<boolean>,
    getConnections: () =>
      ipcRenderer.invoke('safeStorage:getConnections') as Promise<{
        [key: string]: {
          cs: string
          name: string
        }
      }>,
    addConnection: (data: {
      data: {
        cs: string
        name: string
      }
    }): Promise<string> =>
      ipcRenderer.invoke('safeStorage:addConnection', data),
    removeConnection: (data: { key: string }) =>
      ipcRenderer.invoke('safeStorage:removeConnection', data),
    updateConnection: (data: {
      key: string
      data: {
        cs: string
        name: string
      }
    }) => ipcRenderer.invoke('safeStorage:updateConnection', data),
    decryptConnection: (data: { key: string }): Promise<string> =>
      ipcRenderer.invoke('safeStorage:decryptConnection', data),
  },
}

contextBridge.exposeInMainWorld('App', API)
