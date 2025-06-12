import { useEffect, useState } from 'react'
import { useConnections } from 'renderer/providers/connections-provider'
import { Button } from './ui/button'
import { EditIcon, TrashIcon, XIcon } from 'lucide-react'
import ComplexInput from './complex-input'
import { Separator } from './ui/separator'

export const ConnectionsDialog = ({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (open: boolean) => void
}) => {
  const {
    allConnections,
    addConnection,
    selectConnection,
    connectionId,
    updateConnection,
    removeConnection,
  } = useConnections()

  const [connectionString, setConnectionString] = useState('')
  const [name, setName] = useState('')
  const [editingName, setEditingName] = useState('')
  const [editingConnectionString, setEditingConnectionString] =
    useState('decrypting...')
  const [editingConnectionId, setEditingConnectionId] = useState<string | null>(
    null
  )
  const [newConnectionStep, setNewConnectionStep] = useState(false)

  useEffect(() => {
    if (!connectionId) {
      setOpen(true)
    }
  }, [connectionId])

  useEffect(() => {
    if (editingConnectionId) {
      setEditingName(allConnections[editingConnectionId].name)
      setEditingConnectionString('decrypting...')
      window.App.connections
        .decryptConnection({
          key: editingConnectionId,
        })
        .then(connectionString => {
          setEditingConnectionString(connectionString)
        })
    }
  }, [editingConnectionId])

  if (!open) return null

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/80 z-50 flex items-center justify-center backdrop-blur-xl">
      {!!connectionId && (
        <Button
          className="fixed top-8 left-4"
          variant="ghost"
          onClick={() => setOpen(false)}
        >
          <XIcon />
        </Button>
      )}
      <div className="w-full h-full flex items-center justify-center flex-col gap-4">
        {newConnectionStep && !editingConnectionId && (
          <div className="flex flex-col gap-4 w-xl">
            <h1 className="text-2xl font-bold">Add a new connection</h1>
            <p className="text-sm text-muted-foreground">
              Enter the name and connection string for your new connection.
            </p>
            <ComplexInput
              className="w-full"
              label="Name"
              placeholder="My Mongo Database"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <ComplexInput
              className="w-full"
              label="Connection String"
              placeholder="username:password@localhost:27017/database"
              type="text"
              prefix="mongodb://"
              value={connectionString.replace('mongodb://', '')}
              onChange={e => {
                if (e.target.value.startsWith('mongodb://')) {
                  setConnectionString(e.target.value)
                } else {
                  setConnectionString(`mongodb://${e.target.value}`)
                }
              }}
            />
            <Button
              className="w-full"
              onClick={() => {
                if (name && connectionString) {
                  addConnection({
                    name,
                    connectionString,
                  })
                  setNewConnectionStep(false)
                }
              }}
            >
              Add connection
            </Button>
          </div>
        )}

        {!newConnectionStep && (
          <>
            {Object.keys(allConnections).length > 0 && !editingConnectionId && (
              <div className="flex flex-col gap-4 w-xl">
                <h1 className="text-2xl font-bold">Connections</h1>
                <p className="text-sm text-muted-foreground">
                  Select a connection to query its collections.
                </p>
                <div className="flex flex-col gap-2">
                  {Object.keys(allConnections).map(key => (
                    <div className="flex flex-row gap-2" key={key}>
                      <Button
                        variant="ghost"
                        className="flex-1 justify-start"
                        onClick={() => {
                          selectConnection(key)
                          setOpen(false)
                        }}
                      >
                        {allConnections[key].name}
                      </Button>
                      <Separator orientation="vertical" />
                      <Button
                        variant="ghost"
                        onClick={() => {
                          setEditingConnectionId(key)
                        }}
                      >
                        <EditIcon />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {editingConnectionId && (
              <div className="flex flex-col gap-4 w-xl">
                <h1 className="text-2xl font-bold">Edit connection</h1>
                <p className="text-sm text-muted-foreground">
                  Edit the name and connection string for your connection.
                </p>
                <ComplexInput
                  className="w-full"
                  label="Name"
                  placeholder="My Mongo Database"
                  type="text"
                  value={editingName}
                  onChange={e => {
                    setEditingName(e.target.value)
                  }}
                />
                <ComplexInput
                  disabled={editingConnectionString === 'decrypting...'}
                  className="w-full"
                  label="Connection String"
                  placeholder="username:password@localhost:27017/database"
                  type="text"
                  prefix="mongodb://"
                  value={editingConnectionString.replace('mongodb://', '')}
                  onChange={e => {
                    setEditingConnectionString(e.target.value)
                  }}
                />
                <div className="flex flex-row gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      if (!editingName || !editingConnectionString) {
                        return
                      }
                      updateConnection(editingConnectionId, {
                        name: editingName,
                        connectionString: editingConnectionString,
                      })
                      setEditingConnectionId(null)
                    }}
                  >
                    Update {editingName}
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => setEditingConnectionId(null)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      removeConnection(editingConnectionId)
                      setEditingConnectionId(null)
                    }}
                  >
                    <TrashIcon />
                  </Button>
                </div>
              </div>
            )}

            {Object.keys(allConnections).length === 0 && (
              <div className="flex flex-col gap-4 w-xl text-center">
                <h1 className="text-2xl font-bold">No connections found</h1>
                <p className="text-sm text-muted-foreground">
                  Add a new connection to get started.
                </p>
              </div>
            )}

            {!editingConnectionId && (
              <Button
                variant="outline"
                onClick={() => setNewConnectionStep(true)}
              >
                Add a new connection
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  )
}
