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

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [host, setHost] = useState('')
  const [port, setPort] = useState('')
  const [database, setDatabase] = useState('')
  const [name, setName] = useState('')
  const [editingName, setEditingName] = useState('')
  const [editingUsername, setEditingUsername] = useState('')
  const [editingPassword, setEditingPassword] = useState('')
  const [editingHost, setEditingHost] = useState('')
  const [editingPort, setEditingPort] = useState('')
  const [editingDatabase, setEditingDatabase] = useState('')
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
      setEditingUsername('')
      setEditingPassword('')
      setEditingHost('')
      setEditingPort('')
      setEditingDatabase('')
      window.App.connections
        .decryptConnection({
          key: editingConnectionId,
        })
        .then(connectionString => {
          console.log(connectionString)
          const extractedDetails = {
            username: connectionString.split('@')[0].split(':')[0],
            password: connectionString.split('@')[0].split(':')[1],
            host: connectionString.split('@')[1].split(':')[0],
            port: connectionString.split(':').pop()?.split('/')[0] ?? '',
            database: connectionString.split('/')?.[1] ?? '',
          }
          setEditingUsername(extractedDetails.username)
          setEditingPassword(extractedDetails.password)
          setEditingHost(extractedDetails.host)
          setEditingPort(extractedDetails.port)
          setEditingDatabase(extractedDetails.database)
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
          <div className="flex flex-col gap-2 w-xl">
            <h1 className="text-2xl font-bold">Add a new connection</h1>
            <p className="text-sm text-muted-foreground">
              Enter the name and connection string for your new connection.
            </p>
            <ComplexInput
              className="w-full"
              label="Name"
              placeholder="My Mongo Database"
              placeholderAsLabel
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <div className="flex flex-row gap-2 w-full">
              <ComplexInput
                containerClassName="flex-1"
                label="Host"
                placeholderAsLabel
                placeholder="localhost"
                type="text"
                value={host}
                error={!host ? 'Host is required' : undefined}
                onChange={e => setHost(e.target.value)}
              />
              <ComplexInput
                containerClassName="flex-1"
                label="Port"
                placeholder="27017"
                placeholderAsLabel
                type="text"
                value={port}
                error={!port ? 'Port is required' : undefined}
                onChange={e => setPort(e.target.value)}
              />
              <ComplexInput
                containerClassName="flex-1"
                label="Database"
                placeholder="myDatabase (optional)"
                placeholderAsLabel
                type="text"
                value={database}
                onChange={e => setDatabase(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-2 w-full">
              <ComplexInput
                containerClassName="flex-1"
                label="Username"
                placeholder="username"
                placeholderAsLabel
                type="text"
                value={username}
                error={!username ? 'Username is required' : undefined}
                onChange={e => {
                  setUsername(e.target.value)
                }}
              />
              <ComplexInput
                containerClassName="flex-1"
                label="Password"
                placeholder="password"
                placeholderAsLabel
                type="password"
                value={password}
                error={!password ? 'Password is required' : undefined}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="flex flex-row gap-2 w-full mt-4">
              <Button
                className="flex-1"
                variant="outline"
                disabled={!name || !username || !password || !host || !port}
                onClick={() => {
                  if (name && username && password && host && port) {
                    addConnection({
                      name,
                      connectionString: `${username}:${password}@${host}:${port}/${database}`,
                    })
                    setNewConnectionStep(false)
                  }
                }}
              >
                Add connection
              </Button>
              <Button
                variant="ghost"
                onClick={() => setNewConnectionStep(false)}
              >
                Cancel
              </Button>
            </div>
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
                  Edit the connection details.
                </p>
                <ComplexInput
                  className="w-full"
                  label="Name"
                  placeholder="My Mongo Database"
                  placeholderAsLabel
                  type="text"
                  value={editingName}
                  error={!editingName ? 'Name is required' : undefined}
                  onChange={e => {
                    setEditingName(e.target.value)
                  }}
                />
                <div className="flex flex-row gap-2 w-full">
                  <ComplexInput
                    containerClassName="flex-1"
                    label="Host"
                    placeholder="localhost"
                    placeholderAsLabel
                    type="text"
                    value={editingHost}
                    error={!editingHost ? 'Host is required' : undefined}
                    onChange={e => {
                      setEditingHost(e.target.value)
                    }}
                  />
                  <ComplexInput
                    containerClassName="flex-1"
                    label="Port"
                    placeholder="27017"
                    placeholderAsLabel
                    type="text"
                    value={editingPort}
                    error={!editingPort ? 'Port is required' : undefined}
                    onChange={e => {
                      setEditingPort(e.target.value)
                    }}
                  />
                  <ComplexInput
                    className="w-full"
                    label="Database"
                    placeholder="myDatabase (optional)"
                    placeholderAsLabel
                    type="text"
                    value={editingDatabase}
                    error={
                      !editingDatabase ? 'Database is required' : undefined
                    }
                    onChange={e => {
                      setEditingDatabase(e.target.value)
                    }}
                  />
                </div>
                <div className="flex flex-row gap-2 w-full">
                  <ComplexInput
                    containerClassName="flex-1"
                    label="Username"
                    placeholder="admin"
                    placeholderAsLabel
                    type="text"
                    value={editingUsername}
                    error={
                      !editingUsername ? 'Username is required' : undefined
                    }
                    onChange={e => {
                      setEditingUsername(e.target.value)
                    }}
                  />
                  <ComplexInput
                    containerClassName="flex-1"
                    label="Password"
                    placeholder="password"
                    placeholderAsLabel
                    type="password"
                    value={editingPassword}
                    error={
                      !editingPassword ? 'Password is required' : undefined
                    }
                    onChange={e => {
                      setEditingPassword(e.target.value)
                    }}
                  />
                </div>
                <div className="flex flex-row gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      if (
                        !editingName ||
                        !editingUsername ||
                        !editingPassword ||
                        !editingHost ||
                        !editingPort
                      ) {
                        return
                      }
                      updateConnection(editingConnectionId, {
                        name: editingName,
                        connectionString: `${editingUsername}:${editingPassword}@${editingHost}:${editingPort}/${editingDatabase}`,
                      })
                      setEditingConnectionId(null)
                    }}
                  >
                    Update connection
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
