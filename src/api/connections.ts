import { app, ipcMain, safeStorage } from 'electron'
import path from 'node:path'
import fs from 'node:fs'

function useWeakerEncryptionIfNeeded() {
  // TODO: we probably want to inform the user that the encryption is not available
  if (safeStorage.isEncryptionAvailable()) {
    return
  }
  safeStorage.setUsePlainTextEncryption(true)
}

export function getConnectionStringFromKey(key: string) {
  const connections = getConnections()
  if (!connections[key]) {
    throw new Error('Connection not found')
  }
  return safeStorage.decryptString(Buffer.from(connections[key].cs, 'base64'))
}

function getConnections() {
  useWeakerEncryptionIfNeeded()
  if (!fs.existsSync(path.join(app.getPath('userData'), 'connections.json'))) {
    fs.writeFileSync(
      path.join(app.getPath('userData'), 'connections.json'),
      '{}'
    )
  }
  const connections = fs.readFileSync(
    path.join(app.getPath('userData'), 'connections.json'),
    'utf8'
  )
  return JSON.parse(connections) as {
    [key: string]: {
      cs: string
      name: string
    }
  }
}

ipcMain.handle('connections:isEncryptionAvailable', async () => {
  return safeStorage.isEncryptionAvailable()
})

ipcMain.handle('connections:getConnections', async () => {
  return getConnections()
})

ipcMain.handle(
  'connections:addConnection',
  async (
    event,
    data: {
      data: {
        cs: string
        name: string
      }
    }
  ) => {
    const buffer = safeStorage.encryptString(data.data.cs)
    const key = crypto.randomUUID()
    const parsedConnections = getConnections()
    parsedConnections[key] = {
      cs: buffer.toString('base64'),
      name: data.data.name,
    }
    fs.writeFileSync(
      path.join(app.getPath('userData'), 'connections.json'),
      JSON.stringify(parsedConnections, null, 2)
    )
    return { key, encryptedConnectionString: buffer.toString('base64') }
  }
)

ipcMain.handle(
  'connections:removeConnection',
  async (
    event,
    data: {
      key: string
    }
  ) => {
    const parsedConnections = getConnections()
    delete parsedConnections[data.key]
    fs.writeFileSync(
      path.join(app.getPath('userData'), 'connections.json'),
      JSON.stringify(parsedConnections, null, 2)
    )
  }
)

ipcMain.handle(
  'connections:updateConnection',
  async (
    event,
    data: {
      key: string
      data: {
        cs: string
        name: string
      }
    }
  ) => {
    const buffer = safeStorage.encryptString(data.data.cs)
    const parsedConnections = getConnections()
    if (parsedConnections[data.key]) {
      parsedConnections[data.key] = {
        cs: buffer.toString('base64'),
        name: data.data.name,
      }
    } else {
      throw new Error('Connection not found')
    }
    fs.writeFileSync(
      path.join(app.getPath('userData'), 'connections.json'),
      JSON.stringify(parsedConnections, null, 2)
    )
    return parsedConnections
  }
)

ipcMain.handle(
  'connections:decryptConnection',
  async (
    event,
    data: {
      key: string
    }
  ) => {
    const parsedConnections = getConnections()
    if (parsedConnections[data.key]) {
      return safeStorage.decryptString(
        Buffer.from(parsedConnections[data.key].cs, 'base64')
      )
    }
    return undefined
  }
)
