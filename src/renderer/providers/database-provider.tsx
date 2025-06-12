import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Database } from 'shared/models/database'
import { useConnections } from './connections-provider'

interface DatabaseContextType {
  databases: Database[]
  connectionLoading: boolean
  selectedDatabase: Database | null
  setSelectedDatabase: React.Dispatch<React.SetStateAction<Database | null>>
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(
  undefined
)

export const DatabaseProvider = ({ children }: { children: ReactNode }) => {
  const [databases, setDatabases] = useState<Database[]>([])
  const [connectionLoading, setConnectionLoading] = useState(false)
  const [selectedDatabase, setSelectedDatabase] = useState<Database | null>(
    null
  )
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

  const value: DatabaseContextType = {
    databases,
    connectionLoading,
    selectedDatabase,
    setSelectedDatabase,
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
