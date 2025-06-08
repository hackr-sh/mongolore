import { createRootRoute, Outlet } from "@tanstack/react-router";
import { IntroWorkflow } from "renderer/components/intro-workflow";
import { ThemeProvider } from "renderer/providers/theme-provider";
import { Loader2Icon } from "lucide-react";
import { ConfigProvider, useConfig } from "renderer/providers/config-provider";

export const Route = createRootRoute({
  component: () => {
    return (
      <ConfigProvider>
        <ThemeProvider>
          <RootComponent />
        </ThemeProvider>
      </ConfigProvider>
    );
  },
});

const RootComponent = () => {
  const { config, createConfigIfNotExists } = useConfig();

  return (
    <>
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
            createConfigIfNotExists();
          }}
        />
      )}
    </>
  );
};
