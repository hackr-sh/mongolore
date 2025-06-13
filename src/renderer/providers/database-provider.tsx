import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Collection, Database } from 'shared/models/database'
import { useConnections } from './connections-provider'

interface DatabaseContextType {
  databases: Database[]
  collections: Collection[]

  connectionLoading: boolean
  databaseLoading: boolean

  selectedDatabase: Database | null
  selectedCollection: Collection | null

  setSelectedDatabase: React.Dispatch<React.SetStateAction<Database | null>>
  setSelectedCollection: React.Dispatch<React.SetStateAction<Collection | null>>

  createCollection: (collectionName: string) => Promise<void>
  dropCollection: (collectionName: string) => Promise<void>
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
)

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [databases, setDatabases] = useState<Database[]>([])
  const [connectionLoading, setConnectionLoading] = useState(false)
  const [databaseLoading, setDatabaseLoading] = useState(false)
  const [selectedDatabase, setSelectedDatabase] = useState<Database | null>(
    null
  )
  const [collections, setCollections] = useState<Collection[]>([])
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null)
  const { connectionId } = useConnections()
  useEffect(() => {
    if (connectionId) {
      setConnectionLoading(true)
      window.App.db.databases
        .listDatabases({ connectionId })
        .then(setDatabases)
        .catch(error => {
          console.error(error)
          setDatabases([])
        })
        .finally(() => {
          setConnectionLoading(false)
        })
    } else {
      setDatabases([])
    }
  }, [connectionId])

  useEffect(() => {
    if (connectionId && selectedDatabase) {
      setDatabaseLoading(true)
      window.App.db.collections
        .listCollections({
          connectionId,
          databaseName: selectedDatabase.name,
        })
        .then(collections => {
          setCollections(collections)
          setSelectedCollection(collections[0] ?? null)
        })
        .catch(error => {
          console.error(error)
          setCollections([])
        })
        .finally(() => {
          setDatabaseLoading(false)
        })
    }
  }, [selectedDatabase, connectionId])

  const createCollection = async (collectionName: string) => {
    if (!connectionId || !selectedDatabase) {
      throw new Error('Connection ID and selected database are required')
    }
    const collection = await window.App.db.collections.createCollection({
      connectionId,
      databaseName: selectedDatabase?.name,
      collectionName,
    })
    setCollections([...collections, collection])
  }

  const dropCollection = async (collectionName: string) => {
    if (!connectionId || !selectedDatabase) {
      throw new Error('Connection ID and selected database are required')
    }
    const { success } = await window.App.db.collections.dropCollection({
      connectionId,
      databaseName: selectedDatabase?.name,
      collectionName,
    })
    if (success) {
      setCollections(collections.filter(c => c.name !== collectionName))
    }
  }

  const value: DatabaseContextType = {
    databases,
    collections,

    connectionLoading,
    databaseLoading,

    selectedDatabase,
    selectedCollection,

    setSelectedDatabase,
    setSelectedCollection,

    createCollection,
    dropCollection,
  }

  return (
    <DatabaseContext.Provider value={value}>
      {children}
    </DatabaseContext.Provider>
  )
}

export const useDatabase = () => {
  const context = useContext(DatabaseContext)
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider')
  }
  return context
}
