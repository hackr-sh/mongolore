import { ipcRenderer } from 'electron'
import type { Document } from 'mongodb'

type Database = {
  name: string
  sizeOnDisk?: number
  empty?: boolean
} & Document

export default {
  databases: {
    listDatabases: (connectionId: string): Promise<Database[]> =>
      ipcRenderer.invoke('db:listDatabases', connectionId) as Promise<
        Database[]
      >,
  },
}
