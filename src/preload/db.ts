import { ipcRenderer } from 'electron'
import type { Database } from 'shared/models/database'

export default {
  databases: {
    listDatabases: (connectionId: string): Promise<Database[]> =>
      ipcRenderer.invoke('db:listDatabases', connectionId) as Promise<
        Database[]
      >,
  },
}
