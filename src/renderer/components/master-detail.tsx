import { Outlet } from '@tanstack/react-router'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'renderer/components/ui/resizable'
import { useConnections } from 'renderer/providers/connections-provider'
import { Button } from './ui/button'
import { ArrowLeftRightIcon, Loader2Icon } from 'lucide-react'
import { useDatabase } from 'renderer/providers/database-provider'
import ComplexSelect from './complex-select'

export const MasterDetail = ({
  openConnectionsDialog,
}: {
  openConnectionsDialog: () => void
}) => {
  const { connection } = useConnections()
  const {
    connectionLoading,
    databases,
    selectedDatabase,
    collections,
    selectedCollection,
    setSelectedDatabase,
    setSelectedCollection,
  } = useDatabase()
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
        <ResizablePanel
          className="p-4 mt-4 flex flex-row gap-4"
          defaultSize={20}
        >
          {connectionLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2Icon className="h-10 w-10 animate-spin" />
            </div>
          ) : (
            <>
              <div className="flex flex-row gap-2 items-center h-fit">
                <ComplexSelect
                  placeholder="Select a database"
                  triggerClassName="border-0 hover:bg-input"
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
                /
                <ComplexSelect
                  disabled={!selectedDatabase}
                  triggerClassName="border-0 hover:bg-input"
                  placeholder="Select a collection"
                  options={collections.map(col => ({
                    label: col.name,
                    value: col.name,
                  }))}
                  value={selectedCollection?.name}
                  onValueChange={value => {
                    setSelectedCollection(
                      collections.find(col => col.name === value) ?? null
                    )
                  }}
                />
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
