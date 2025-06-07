import { Outlet } from "@tanstack/react-router";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "renderer/components/ui/resizable";

export const MasterDetail = () => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={20}>
        <div>Master</div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel>
        <Outlet />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};
