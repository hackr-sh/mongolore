import { contextBridge } from 'electron'
import connections from './connections'
import db from './db'
import settings from './settings'

declare global {
  interface Window {
    App: typeof API
  }
}

const API = {
  settings: settings,
  connections: connections,
  db: db,
}

contextBridge.exposeInMainWorld('App', API)
