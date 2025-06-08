import { app, ipcMain, safeStorage } from "electron";
import path from "node:path";
import fs from "node:fs";

ipcMain.handle("safeStorage:isEncryptionAvailable", async () => {
  return safeStorage.isEncryptionAvailable();
});
