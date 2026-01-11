import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";
import { NoAccessToAi } from "./NoAccessToAi";
import { ProfileSettings } from "./ProfileSettings";

//Importing custom types
import type { IntroductionStep, AppViews } from "@/types";

const steps: IntroductionStep[] = [
  {
    title: "Highlight & translate instantly",
    description:
      "Select any text on the page and get an instant translation without leaving what you're doing.",
    badge: "Step 1",
  },
  {
    title: "Save words and phrases to your dictionary",
    description:
      "Save words and phrases to your dictionary so you can learn them and reuse them later.",
    badge: "Step 2",
  },
];

function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [hasAccessAI] = useState("Translator" in window);
  const [appView, setAppView] = useState<AppViews>("settings");

  const activeStep = steps[activeIndex];
  const goTo = (index: number) => {
    if (index < 0 || index >= steps.length) return;
    setActiveIndex(index);
  };
  const goNext = () => goTo(activeIndex + 1);
  const goPrev = () => goTo(activeIndex - 1);

  const openView = (view: AppViews) => {
    setAppView(view);
  };

  // If the user doesnt have access to chrome local AI, show requirements
  if (!hasAccessAI) {
    return <NoAccessToAi />;
  }

  if (appView === "settings") {
    return (
      <Layout
        title="Translation Settings"
        subtitle="Customize your translation experience"
        onNavigate={openView}
      >
        <ProfileSettings />
      </Layout>
    );
  }

  return (
    <Layout
      title="Your AI translation sidekick"
      subtitle="Translate and expand your vocabulary with help of local AI."
      onNavigate={openView}
    >
      {/* Carousel card */}
      <div className="relative flex flex-1 flex-col rounded-xl border border-border bg-card px-4 py-4">
        {/* Header with badge and dots */}
        <div className="flex items-center justify-between gap-2 mb-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-primary">
            <span className="size-1.5 rounded-full bg-primary ring-2 ring-primary/40" />
            {activeStep.badge}
          </span>

          <div className="flex items-center gap-1.5">
            {steps.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => goTo(index)}
                className={[
                  "h-1.5 rounded-full transition-all",
                  index === activeIndex ? "w-4 bg-primary" : "w-1.5 bg-muted hover:bg-muted/80",
                ].join(" ")}
                aria-label={`Go to step ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 space-y-3 text-foreground">
          <h2 className="text-base font-semibold leading-tight">{activeStep.title}</h2>
          <p className="text-xs leading-relaxed text-muted-foreground">{activeStep.description}</p>
        </div>

        {/* Footer */}
        <div className="mt-4">
          <div className="flex items-center justify-end gap-2">
            <Button
              size="sm"
              variant="ghost"
              className="h-7 px-3 text-[10px] text-muted-foreground hover:bg-muted"
              onClick={goPrev}
              disabled={activeIndex === 0}
            >
              Back
            </Button>
            <Button
              size="sm"
              className="h-7 px-3 text-[10px] font-semibold"
              onClick={goNext}
              disabled={activeIndex === steps.length - 1}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;

