import { createContext, useContext, useEffect, useState } from 'react'

interface ConnectionsContextValue {
  connectionId: string | undefined
  connection:
    | {
        cs: string
        name: string
      }
    | undefined
  allConnections: {
    [key: string]: {
      cs: string
      name: string
    }
  }
  isEncryptionAvailable: boolean
  checkEncryptionAvailability: () => Promise<boolean>
  addConnection: ({
    name,
    connectionString,
  }: {
    name: string
    connectionString: string
  }) => Promise<void>
  removeConnection: (id: string) => Promise<void>
  updateConnection: (id: string, details: Partial<string>) => Promise<void>
  selectConnection: (id?: string) => void
}

const ConnectionsContext = createContext<ConnectionsContextValue | undefined>(
  undefined
)

export function ConnectionsProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [connections, setConnections] = useState<{
    [key: string]: {
      cs: string
      name: string
    }
  }>({})
  const [selectedConnectionId, setSelectedConnectionId] = useState<
    string | undefined
  >()
  const [connection, setConnection] = useState<
    | {
        cs: string
        name: string
      }
    | undefined
  >()
  const [isEncryptionAvailable, setIsEncryptionAvailable] = useState<
    'loading' | boolean
  >(false)

  useEffect(() => {
    window.App.safeStorage.getConnections().then(savedConnections => {
      if (savedConnections) {
        setConnections(savedConnections)
      }
    })
  }, [])

  useEffect(() => {
    if (selectedConnectionId) {
      setConnection(connections[selectedConnectionId])
    }
  }, [selectedConnectionId])

  useEffect(() => {
    checkEncryptionAvailability().then(isAvailable => {
      if (!isAvailable) {
        setIsEncryptionAvailable(false)
      } else {
        setIsEncryptionAvailable(true)
      }
    })
  }, [])

  const checkEncryptionAvailability = async () => {
    return await window.App.safeStorage.isEncryptionAvailable()
  }

  const addConnection = async ({
    name,
    connectionString,
  }: {
    name: string
    connectionString: string
  }) => {
    const { key, encryptedConnectionString } =
      await window.App.safeStorage.addConnection({
        data: {
          cs: connectionString,
          name: name,
        },
      })
    const updatedConnections = {
      ...connections,
      [key]: { cs: encryptedConnectionString, name: name },
    }
    setConnections(updatedConnections)
  }

  const removeConnection = async (id: string) => {
    await window.App.safeStorage.removeConnection({
      key: id,
    })
    const updatedConnections = { ...connections }
    delete updatedConnections[id]
    setConnections(updatedConnections)

    if (selectedConnectionId === id) {
      setSelectedConnectionId(undefined)
    }
  }

  const updateConnection = async (id: string, connectionString: string) => {
    const updatedConnections = {
      ...connections,
      [id]: { cs: connectionString, name: connections[id].name },
    }
    await window.App.safeStorage.updateConnection({
      key: id,
      data: {
        cs: connectionString,
        name: connections[id].name,
      },
    })
    setConnections(updatedConnections)
  }

  const selectConnection = (id?: string) => {
    console.log('slectedConnectionId', selectedConnectionId)
    setSelectedConnectionId(id)
  }

  const decryptConnection = async (id: string) => {
    return await window.App.safeStorage.decryptConnection({ key: id })
  }

  return (
    <ConnectionsContext.Provider
      value={{
        connectionId: selectedConnectionId,
        connection: connection,
        allConnections: connections,
        isEncryptionAvailable: isEncryptionAvailable === true,
        checkEncryptionAvailability,
        addConnection,
        removeConnection,
        updateConnection,
        selectConnection,
      }}
    >
      {children}
    </ConnectionsContext.Provider>
  )
}

export function useConnections() {
  const context = useContext(ConnectionsContext)
  if (!context) {
    throw new Error('useConnections must be used within a ConnectionsProvider')
  }
  return context
}
