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
    [key: string]: string
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
      data: string
    }
  ) => {
    const buffer = safeStorage.encryptString(data.data)
    const key = crypto.randomUUID()
    const parsedConnections = getConnections()
    parsedConnections[key] = buffer.toString('base64')
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
      data: string
    }
  ) => {
    const buffer = safeStorage.encryptString(data.data)
    const parsedConnections = getConnections()
    if (parsedConnections[data.key]) {
      parsedConnections[data.key] = buffer.toString('base64')
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
        Buffer.from(parsedConnections[data.key], 'base64')
      )
    }
    return undefined
  }
)
