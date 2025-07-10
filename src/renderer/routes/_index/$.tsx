import { createFileRoute } from '@tanstack/react-router'
import { useDatabase } from 'renderer/providers/database-provider'

export const Route = createFileRoute('/_index/$')({
  component: RouteComponent,
})

function RouteComponent() {
  const { selectedDatabase, selectedCollection } = useDatabase()
  return (
    <div className="flex flex-col h-full w-full">
      <h2 className="text-sm -mt-4 mb-4">
        <span className="text-muted-foreground/70">
          {selectedDatabase?.name} /{' '}
        </span>
        <span className="font-bold">{selectedCollection?.name}</span>
      </h2>
      <div className="flex flex-col gap-4 flex-1 justify-between overflow-y-auto">
        <pre className="text-xl sticky top-0">documents: [</pre>
        <div className="flex flex-col gap-4 flex-1">documents here</div>
        <pre className="text-xl sticky bottom-0">];</pre>
      </div>
    </div>
  )
}
