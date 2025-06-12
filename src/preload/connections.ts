import { ipcRenderer } from 'electron'

export default {
  isEncryptionAvailable: () =>
    ipcRenderer.invoke('connections:isEncryptionAvailable') as Promise<boolean>,
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
}
