import { createRootRoute, Outlet } from "@tanstack/react-router";
import { ThemeProvider } from "renderer/components/theme-provider";

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider>
      <Outlet />
    </ThemeProvider>
  ),
});
