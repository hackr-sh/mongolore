import { createFileRoute } from '@tanstack/react-router'
import { useConnections } from 'renderer/providers/connections-provider'

export const Route = createFileRoute('/_index/')({
  component: Index,
})

function Index() {
  const { connectionId, connection } = useConnections()
  return (
    <div className="p-2">
      <pre className="text-xs">
        {JSON.stringify({ connectionId, connection }, null, 2)}
      </pre>
    </div>
  )
}
