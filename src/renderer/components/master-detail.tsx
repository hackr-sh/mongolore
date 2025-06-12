import { Outlet } from '@tanstack/react-router'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'renderer/components/ui/resizable'
import { useConnections } from 'renderer/providers/connections-provider'
import { Button } from './ui/button'
import { ArrowLeftRightIcon } from 'lucide-react'

export const MasterDetail = ({
  openConnectionsDialog,
}: {
  openConnectionsDialog: () => void
}) => {
  const { connection } = useConnections()
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
        <ResizablePanel className="p-4 mt-4" defaultSize={20}>
          Master
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel className="p-4 mt-4">
          <Outlet />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
