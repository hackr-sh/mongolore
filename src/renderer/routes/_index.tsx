import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { ConnectionsDialog } from 'renderer/components/connections-dialog'
import { MasterDetail } from 'renderer/components/master-detail'

export const Route = createFileRoute('/_index')({
  component: RouteComponent,
})

function RouteComponent() {
  const [connectionsDialogOpen, setConnectionsDialogOpen] = useState(false)
  return (
    <div className="flex h-screen w-screen">
      <ConnectionsDialog
        open={connectionsDialogOpen}
        setOpen={setConnectionsDialogOpen}
      />
      <MasterDetail
        openConnectionsDialog={() => setConnectionsDialogOpen(true)}
      />
    </div>
  )
}
