import { BlurFade } from "components/magicui/blur-fade";
import { TypingAnimation } from "components/magicui/typing-animation";
import { ArrowRightIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export const IntroWorkflow = ({ onDone }: { onDone: () => void }) => {
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
          <Done
            onNext={() => {
              window.App.settings.createConfigFileIfNotExists();
              onDone();
            }}
          />
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
      <BlurFade
        delay={(21 * 35) / 1000}
        className="mt-2 w-full flex justify-center items-center "
      >
        <Button
          className="flex flex-row gap-2 items-center justify-center hover:[&_svg]:translate-x-1"
          variant="ghost"
          onClick={() => onNext("settings")}
        >
          <TypingAnimation
            delay={23 * 35}
            duration={35}
            className="text-sm font-bold text-muted-foreground"
            startOnView
            as="h2"
          >
            Let's get you started!
          </TypingAnimation>
          <BlurFade delay={((23 + 22) * 35 + 300) / 1000}>
            <ArrowRightIcon className="h-4 w-4 animate-pulse transition-all" />
          </BlurFade>
        </Button>
      </BlurFade>
    </div>
  );
};

const Settings = ({
  onNext,
}: {
  onNext: React.Dispatch<React.SetStateAction<"welcome" | "settings" | "done">>;
}) => {
  return (
    <div>
      <TypingAnimation
        duration={35}
        className="text-muted-foreground"
        startOnView
        as="h1"
      >
        You will eventually be able to configure your settings here.
      </TypingAnimation>
      <BlurFade
        delay={(60 * 35) / 1000}
        className="mt-2 w-full flex justify-center items-center "
      >
        <Button
          className="flex flex-row gap-2 items-center justify-center hover:[&_svg]:translate-x-1"
          variant="ghost"
          onClick={() => onNext("settings")}
        >
          Create default config file and continue
        </Button>
      </BlurFade>
    </div>
  );
};

const Done = ({
  onNext,
}: {
  onNext: React.Dispatch<React.SetStateAction<"welcome" | "settings" | "done">>;
}) => {
  return <div>Done</div>;
};
