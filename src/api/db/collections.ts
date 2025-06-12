import { ipcMain } from 'electron'
import { getClient } from 'api/db/general'

ipcMain.handle(
  'db:listCollections',
  async (
    event,
    {
      connectionId,
      databaseName,
    }: { connectionId: string; databaseName: string }
  ) => {
    const client = await getClient(connectionId)
    const db = client.db(databaseName)
    const collections = await db.listCollections().toArray()
    return collections
  }
)
