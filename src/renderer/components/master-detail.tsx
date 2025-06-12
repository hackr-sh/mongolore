import { Outlet } from '@tanstack/react-router'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from 'renderer/components/ui/resizable'
import { useConnections } from 'renderer/providers/connections-provider'

export const MasterDetail = () => {
  const { connection } = useConnections()
  return (
    <div className="flex flex-col h-full w-full">
      <div className="w-full pt-8 p-4 border-border border-b">
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
