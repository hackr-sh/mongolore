import { getConnectionStringFromKey } from 'api/connections'
import { MongoClient } from 'mongodb'

let currentConnectionString: string | null = null
let client: MongoClient | null = null

export async function getClient(key: string) {
  const connectionString = getConnectionStringFromKey(key)
  if (client && currentConnectionString === connectionString) {
    return client
  }
  currentConnectionString = connectionString
  client = new MongoClient(`mongodb://${connectionString}`)
  await client.connect()
  return client
}
