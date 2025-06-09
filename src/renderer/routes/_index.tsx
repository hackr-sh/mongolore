import { createFileRoute } from '@tanstack/react-router'
import { ConnectionsDialog } from 'renderer/components/connections-dialog'
import { MasterDetail } from 'renderer/components/master-detail'

export const Route = createFileRoute('/_index')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex h-screen w-screen">
      <ConnectionsDialog />
      <MasterDetail />
    </div>
  )
}
