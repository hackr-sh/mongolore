import { createContext, useContext, useEffect, useState } from "react";
import type { MongoloreConfig } from "shared/models/mongolore-config";

interface ConfigContextValue {
  config: "loading" | MongoloreConfig | undefined;
  createConfigIfNotExists: () => Promise<void>;
}

const ConfigContext = createContext<ConfigContextValue | undefined>(undefined);

export function ConfigProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<MongoloreConfig | undefined>();

  useEffect(() => {
    window.App.settings.getConfigFile().then(setConfig);
  }, []);

  const createConfigIfNotExists = async () => {
    const newConfig = await window.App.settings.getConfigFile();
    setConfig(newConfig);
  };

  return (
    <ConfigContext.Provider
      value={{
        config,
        createConfigIfNotExists,
      }}
    >
      {children}
    </ConfigContext.Provider>
  );
}

export function useConfig() {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context;
}
