import { useEffect, useState } from 'react'
import { useConnections } from 'renderer/providers/connections-provider'
import { Button } from './ui/button'
import { XIcon } from 'lucide-react'
import ComplexInput from './complex-input'

export const ConnectionsDialog = () => {
  const { allConnections } = useConnections()
  const [open, setOpen] = useState(false)
  const [connectionString, setConnectionString] = useState('')
  const [name, setName] = useState('')
  const [newConnectionStep, setNewConnectionStep] = useState(false)

  useEffect(() => {
    if (allConnections.length === 0) {
      setOpen(true)
    }
  }, [allConnections])

  if (!open) return null

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black/80 z-50 flex items-center justify-center backdrop-blur-xl">
      {allConnections.length > 0 ? (
        <Button
          className="fixed top-8 left-4"
          variant="ghost"
          onClick={() => setOpen(false)}
        >
          <XIcon />
        </Button>
      ) : null}
      <div className="w-full h-full flex items-center justify-center flex-col gap-4">
        {newConnectionStep && (
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
          </div>
        )}

        {!newConnectionStep && (
          <>
            {allConnections.length > 0 && (
              <div className="flex flex-col gap-4 w-xl">
                <h1 className="text-2xl font-bold">Connections</h1>
                <p className="text-sm text-muted-foreground">
                  Select a connection to view its databases.
                </p>
              </div>
            )}

            {allConnections.length === 0 && (
              <div className="flex flex-col gap-4 w-xl text-center">
                <h1 className="text-2xl font-bold">No connections found</h1>
                <p className="text-sm text-muted-foreground">
                  Add a new connection to get started.
                </p>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => setNewConnectionStep(true)}
            >
              Add a new connection
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
