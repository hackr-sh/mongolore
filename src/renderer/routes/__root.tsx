import { createRootRoute, Outlet } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { IntroWorkflow } from "renderer/components/intro-workflow";
import { ThemeProvider } from "renderer/components/theme-provider";
import type { MongoloreConfig } from "shared/models/mongolore-config";
import { Loader2Icon } from "lucide-react";

export const Route = createRootRoute({
  component: () => {
    const [config, setConfig] = useState<
      "loading" | MongoloreConfig | undefined
    >("loading");
    useEffect(() => {
      window.App.settings.getConfigFile().then((config) => {
        setConfig(config);
      });
    }, []);
    return (
      <ThemeProvider>
        <div
          className="w-full h-8 pointer-events-none fixed top-0 left-0 z-[9999]"
          style={
            { "-webkit-app-region": "drag" } as unknown as React.CSSProperties
          }
        />
        {config === "loading" ? (
          <div className="flex h-screen w-screen items-center justify-center">
            <Loader2Icon className="h-10 w-10 animate-spin" />
          </div>
        ) : config ? (
          <Outlet />
        ) : (
          <IntroWorkflow
            onDone={() => {
              window.App.settings.getConfigFile().then((config) => {
                setConfig(config);
              });
            }}
          />
        )}
      </ThemeProvider>
    );
  },
});
