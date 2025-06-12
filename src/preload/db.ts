import type { Document } from 'bson'
import { ipcRenderer } from 'electron'

type Database = {
  name: string
  sizeOnDisk?: number
  empty?: boolean
} & Document

export default {
  listDatabases: (connectionId: string): Promise<Database[]> =>
    ipcRenderer.invoke('db:listDatabases', connectionId) as Promise<Database[]>,
}
