import { createFileRoute } from '@tanstack/react-router'
import { useConnections } from 'renderer/providers/connections-provider'

export const Route = createFileRoute('/_index/')({
  component: Index,
})

function Index() {
  const { connectionId, connection } = useConnections()
  return (
    <div className="relative h-full w-full">
      <pre className="text-xs absolute top-0 left-0 w-full h-full">
        {JSON.stringify({ connectionId, connection }, null, 2)}
      </pre>

      <div className="flex flex-col h-full w-full justify-center items-center">
        <div className="flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-bold">No collections selected</h1>
          <p className="text-sm text-muted-foreground">
            Please select a collection to continue.
          </p>
        </div>
      </div>
    </div>
  )
}
