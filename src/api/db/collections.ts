import { ipcMain } from 'electron'
import { getClient } from 'api/db/general'

ipcMain.handle(
  'db:collections:listCollections',
  async (
    event,
    {
      connectionId,
      databaseName,
    }: { connectionId: string; databaseName: string }
  ) => {
    const client = await getClient(connectionId)
    const db = client.db(databaseName)
    const collections = (await db.listCollections().toArray()).sort((a, b) =>
      a.name.localeCompare(b.name)
    )
    return collections
  }
)

ipcMain.handle(
  'db:collections:createCollection',
  async (
    event,
    {
      connectionId,
      databaseName,
      collectionName,
    }: { connectionId: string; databaseName: string; collectionName: string }
  ) => {
    const client = await getClient(connectionId)
    const db = client.db(databaseName)
    await db.createCollection(collectionName)
    return (
      await db
        .listCollections({
          name: collectionName,
        })
        .toArray()
    )[0]
  }
)

ipcMain.handle(
  'db:collections:dropCollection',
  async (
    event,
    {
      connectionId,
      databaseName,
      collectionName,
    }: { connectionId: string; databaseName: string; collectionName: string }
  ) => {
    const client = await getClient(connectionId)
    const db = client.db(databaseName)
    const success = await db.dropCollection(collectionName)
    return { success }
  }
)
