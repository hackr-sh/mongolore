import type { Document } from 'mongodb'

export type Database = {
  name: string
  sizeOnDisk?: number
  empty?: boolean
} & Document
