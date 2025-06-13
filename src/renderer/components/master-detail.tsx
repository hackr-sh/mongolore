import { Outlet } from '@tanstack/react-router'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'renderer/components/ui/resizable'
import { useConnections } from 'renderer/providers/connections-provider'
import { Button } from './ui/button'
import { ArrowLeftRightIcon, Loader2Icon, PlusIcon } from 'lucide-react'
import { useDatabase } from 'renderer/providers/database-provider'
import ComplexSelect from './complex-select'
import { cn } from 'renderer/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog'
import ComplexInput from './complex-input'
import { useEffect, useState } from 'react'

export const MasterDetail = ({
  openConnectionsDialog,
}: {
  openConnectionsDialog: () => void
}) => {
  const [newCollectionDialogOpen, setNewCollectionDialogOpen] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [newDatabaseName, setNewDatabaseName] = useState('')
  const [newDatabaseOption, setNewDatabaseOption] = useState<string | null>(
    null
  )

  const { connection } = useConnections()
  const {
    connectionLoading,
    databases,
    selectedDatabase,
    collections,
    selectedCollection,
    setSelectedDatabase,
    setSelectedCollection,
    createCollection,
  } = useDatabase()

  useEffect(() => {
    if (newDatabaseOption === 'create-new-database') {
      setNewDatabaseName('')
    } else {
      setNewDatabaseName(newDatabaseOption ?? '')
    }
  }, [newDatabaseOption])

  useEffect(() => {
    setNewCollectionName('')
    setNewDatabaseOption(null)
    setNewDatabaseName('')
  }, [newCollectionDialogOpen])

  return (
    <div className="flex flex-col h-full w-full">
      <div className="w-full pt-8 p-4 border-border border-b flex flex-row gap-4">
        <Button variant="outline" onClick={openConnectionsDialog}>
          <ArrowLeftRightIcon />
        </Button>
        <h1 className="text-2xl font-bold">
          {connection?.name ?? 'No connection selected'}
        </h1>
      </div>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="p-4 flex flex-col gap-4" defaultSize={20}>
          {connectionLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2Icon className="h-10 w-10 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex flex-row gap-2">
                <Dialog
                  open={newCollectionDialogOpen}
                  onOpenChange={setNewCollectionDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => setNewCollectionDialogOpen(true)}
                      variant="outline"
                      size="sm"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create a new collection</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-row gap-2 items-center *:flex-1">
                      {newDatabaseOption === 'create-new-database' ? (
                        <ComplexInput
                          placeholder="Enter database name"
                          type="text"
                          value={newDatabaseName}
                          onChange={e => {
                            setNewDatabaseName(e.target.value)
                          }}
                        />
                      ) : (
                        <ComplexSelect
                          placeholder="Select a database"
                          triggerClassName="border-0 hover:bg-input transition-colors"
                          options={databases
                            .map(db => ({
                              label: db.name,
                              value: db.name,
                            }))
                            .concat({
                              label: 'Create a new database',
                              value: 'create-new-database',
                            })}
                          value={newDatabaseOption ?? undefined}
                          onValueChange={setNewDatabaseOption}
                        />
                      )}
                      /
                      <ComplexInput
                        placeholder="Enter collection name"
                        type="text"
                        value={newCollectionName}
                        onChange={e => {
                          setNewCollectionName(e.target.value)
                        }}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={() => {
                          createCollection(newDatabaseName, newCollectionName)
                            .catch(error => {
                              console.error(error)
                            })
                            .finally(() => {
                              setNewCollectionDialogOpen(false)
                            })
                        }}
                      >
                        Create
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
                <ComplexSelect
                  placeholder="Select a database"
                  triggerClassName="border-0 hover:bg-input transition-colors"
                  options={databases.map(db => ({
                    label: db.name,
                    value: db.name,
                  }))}
                  value={selectedDatabase?.name}
                  onValueChange={value => {
                    setSelectedDatabase(
                      databases.find(db => db.name === value) ?? null
                    )
                  }}
                />
              </div>
              <div className="flex flex-col gap-1 mt-4">
                {collections.map(collection => (
                  <Button
                    size="sm"
                    key={collection.name}
                    variant="ghost"
                    className={cn(
                      'w-full justify-start p-3 text-sm transition-colors',
                      selectedCollection?.name === collection.name &&
                        'bg-input text-primary hover:bg-input'
                    )}
                    onClick={() => {
                      setSelectedCollection(collection)
                    }}
                  >
                    {collection.name}
                  </Button>
                ))}
              </div>
            </>
          )}
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="p-4 mt-4">
          {connectionLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2Icon className="h-10 w-10 animate-spin" />
            </div>
          ) : (
            <Outlet />
          )}
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
