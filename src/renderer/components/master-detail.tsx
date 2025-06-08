import { Outlet } from "@tanstack/react-router";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "renderer/components/ui/resizable";

export const MasterDetail = () => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel className="p-4 mt-4" defaultSize={20}>
        Master
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel className="p-4 mt-4">
        <Outlet />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
