import { ipcRenderer } from 'electron'
import type { Database } from 'shared/models/database'

export default {
  databases: {
    listDatabases: (data: {
      connectionId: string
    }): Promise<Database[]> =>
      ipcRenderer.invoke('db:databases:listDatabases', data) as Promise<
        Database[]
      >,
  },
}
