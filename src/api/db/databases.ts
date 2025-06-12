import { ipcMain } from 'electron'
import { getClient } from 'api/db/general'

ipcMain.handle(
  'db:listDatabases',
  async (event, { connectionId }: { connectionId: string }) => {
    const client = await getClient(connectionId)
    const databases = await client.db().admin().listDatabases()
    return databases.databases
  }
)
