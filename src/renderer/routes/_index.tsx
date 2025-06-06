import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_index")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      Hello "/index/_index"!
      <Outlet />
    </div>
  );
}
