import { createContext, useContext, useEffect, useState } from 'react'

interface ConnectionsContextValue {
  connection: string | undefined
  allConnections: string[]
  isEncryptionAvailable: boolean
  checkEncryptionAvailability: () => Promise<boolean>
  addConnection: (details: string) => Promise<void>
  removeConnection: (id: string) => Promise<void>
  updateConnection: (id: string, details: Partial<string>) => Promise<void>
  selectConnection: (id: string) => void
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
    [key: string]: string
  }>({})
  const [selectedConnectionId, setSelectedConnectionId] = useState<
    string | undefined
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

  const addConnection = async (connectionString: string) => {
    const key = await window.App.safeStorage.addConnection({
      data: connectionString,
    })
    const updatedConnections = { ...connections, [key]: connectionString }
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
    const updatedConnections = { ...connections, [id]: connectionString }
    await window.App.safeStorage.updateConnection({
      key: id,
      data: connectionString,
    })
    setConnections(updatedConnections)
  }

  const selectConnection = (id: string) => {
    setSelectedConnectionId(id)
  }

  return (
    <ConnectionsContext.Provider
      value={{
        connection: selectedConnectionId
          ? connections[selectedConnectionId]
          : undefined,
        allConnections: Object.values(connections),
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
