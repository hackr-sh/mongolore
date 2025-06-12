import { contextBridge, ipcRenderer } from 'electron'
import type { MongoloreConfig } from 'shared/models/mongolore-config'
import db from './db'

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
  connections: {
    isEncryptionAvailable: () =>
      ipcRenderer.invoke(
        'connections:isEncryptionAvailable'
      ) as Promise<boolean>,
    getConnections: () =>
      ipcRenderer.invoke('connections:getConnections') as Promise<{
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
    }): Promise<{ key: string; encryptedConnectionString: string }> =>
      ipcRenderer.invoke('connections:addConnection', data),
    removeConnection: (data: { key: string }) =>
      ipcRenderer.invoke('connections:removeConnection', data),
    updateConnection: (data: {
      key: string
      data: {
        cs: string
        name: string
      }
    }): Promise<{ [key: string]: { cs: string; name: string } }> =>
      ipcRenderer.invoke('connections:updateConnection', data),
    decryptConnection: (data: { key: string }): Promise<string> =>
      ipcRenderer.invoke('connections:decryptConnection', data),
  },
  db: db,
}

contextBridge.exposeInMainWorld('App', API)
