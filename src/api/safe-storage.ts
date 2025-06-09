import { app, ipcMain, safeStorage } from 'electron'
import path from 'node:path'
import fs from 'node:fs'

function getConnections() {
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

ipcMain.handle('safeStorage:isEncryptionAvailable', async () => {
  return safeStorage.isEncryptionAvailable()
})

ipcMain.handle('safeStorage:getConnections', async () => {
  return getConnections()
})

ipcMain.handle(
  'safeStorage:addConnection',
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
    return key
  }
)

ipcMain.handle(
  'safeStorage:removeConnection',
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
  'safeStorage:updateConnection',
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
        name: parsedConnections[data.key].name,
      }
    } else {
      throw new Error('Connection not found')
    }
    fs.writeFileSync(
      path.join(app.getPath('userData'), 'connections.json'),
      JSON.stringify(parsedConnections, null, 2)
    )
  }
)

ipcMain.handle(
  'safeStorage:decryptConnection',
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
