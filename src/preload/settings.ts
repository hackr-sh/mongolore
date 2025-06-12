import { ipcRenderer } from 'electron'
import type { MongoloreConfig } from 'shared/models/mongolore-config'

export default {
  getConfigFile: () =>
    ipcRenderer.invoke('settings:getConfigFile') as Promise<
      MongoloreConfig | undefined
    >,
  createConfigFileIfNotExists: () =>
    ipcRenderer.invoke('settings:createConfigFileIfNotExists'),
}
