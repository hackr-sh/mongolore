import { app, ipcMain } from "electron";
import path from "node:path";
import fs from "node:fs";
import { defaultConfig } from "resources/config/defaultConfig";

ipcMain.handle("settings:getConfigFile", () => {
  const configFile = path.join(app.getPath("userData"), "config.json");
  if (!fs.existsSync(configFile)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(configFile, "utf8"));
});

ipcMain.handle("settings:createConfigFileIfNotExists", () => {
  const configFile = path.join(app.getPath("userData"), "config.json");
  if (fs.existsSync(configFile)) {
    return null;
  }
  fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2));
});
