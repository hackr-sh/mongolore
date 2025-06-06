import { BlurFade } from "components/magicui/blur-fade";
import { TypingAnimation } from "components/magicui/typing-animation";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";

export const IntroWorkflow = () => {
  const [workflowStep, setWorkflowStep] = useState<
    "welcome" | "settings" | "done"
  >("welcome");

  return (
    <div className="flex h-screen w-screen items-center justify-center">
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
  return (
    <div>
      <TypingAnimation
        duration={35}
        className="text-2xl font-bold"
        startOnView
        as="h1"
      >
        Welcome to mongolore!
      </TypingAnimation>
      <div className="flex flex-row gap-2 items-center justify-center mt-2">
        <TypingAnimation
          delay={21 * 35}
          duration={35}
          className="text-sm font-bold text-muted-foreground"
          startOnView
          as="h2"
        >
          Let's get you started!
        </TypingAnimation>
        <BlurFade delay={((21 + 22) * 35 + 300) / 1000}>
          <ArrowRightIcon className="h-4 w-4 animate-pulse" />
        </BlurFade>
      </div>
    </div>
  );
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
