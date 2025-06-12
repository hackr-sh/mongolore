import type { CollectionInfo, Document } from 'mongodb'

export type Database = {
  name: string
  sizeOnDisk?: number
  empty?: boolean
} & Document

export type Collection = CollectionInfo | Pick<CollectionInfo, 'name' | 'type'>
