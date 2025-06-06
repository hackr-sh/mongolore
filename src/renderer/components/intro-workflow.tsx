import { useState } from "react";

export const IntroWorkflow = () => {
  const [workflowStep, setWorkflowStep] = useState<
    "welcome" | "settings" | "done"
  >("welcome");

  return (
    <div>
      <div>
        {workflowStep === "welcome" && (
          <Welcome onNext={() => setWorkflowStep("settings")} />
        )}
        {workflowStep === "settings" && (
          <Settings onNext={() => setWorkflowStep("done")} />
        )}
        {workflowStep === "done" && (
          <Done onNext={() => setWorkflowStep("welcome")} />
        )}
      </div>
    </div>
  );
};

const Welcome = ({
  onNext,
}: {
  onNext: React.Dispatch<React.SetStateAction<"welcome" | "settings" | "done">>;
}) => {
  return <div>Welcome</div>;
};

const Settings = ({
  onNext,
}: {
  onNext: React.Dispatch<React.SetStateAction<"welcome" | "settings" | "done">>;
}) => {
  return <div>Settings</div>;
};

const Done = ({
  onNext,
}: {
  onNext: React.Dispatch<React.SetStateAction<"welcome" | "settings" | "done">>;
}) => {
  return <div>Done</div>;
};
