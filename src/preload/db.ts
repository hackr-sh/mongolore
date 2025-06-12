import { ipcRenderer } from 'electron'
import type { Collection, Database } from 'shared/models/database'

export default {
  databases: {
    listDatabases: (data: {
      connectionId: string
    }): Promise<Database[]> =>
      ipcRenderer.invoke('db:databases:listDatabases', data) as Promise<
        Database[]
      >,
  },
  collections: {
    listCollections: (data: {
      connectionId: string
      databaseName: string
    }): Promise<Collection[]> =>
      ipcRenderer.invoke('db:collections:listCollections', data) as Promise<
        Collection[]
      >,
  },
}
