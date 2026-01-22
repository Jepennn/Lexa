import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MousePointerClick, BookOpen, PanelRightOpen, Check, ArrowLeft, Settings2, Command, ArrowUp, Option } from "lucide-react";
import { cn } from "@/lib/utils";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface OnboardingProps {
  onComplete: () => void;
}

// Helper component for keyboard shortcuts
function ShortcutDisplay({ keys, isMac }: { keys: string[], isMac: boolean }) {
  return (
    <span className="inline-flex align-baseline mx-1">
      <KbdGroup>
        {keys.map((key, index) => {
          let content: React.ReactNode = key;
          
          if (isMac) {
            if (key === "Meta") content = <Command className="size-3" />;
            else if (key === "Shift") content = <ArrowUp className="size-3" />;
            else if (key === "Alt") content = <Option className="size-3" />;
            else if (key === "Ctrl") content = "^";
          } else {
            if (key === "Meta") content = "Ctrl";
            else if (key === "Shift") content = "Shift";
            else if (key === "Alt") content = "Alt";
          }

          return (
            <Kbd key={index} className="shadow-xs">
              {content}
            </Kbd>
          );
        })}
      </KbdGroup>
    </span>
  );
}

const STEPS = [
  {
    title: "Select & Translate",
    description: (isMac: boolean) => (
      <>
        Highlight text, right-click 'Translate', or use 
        <ShortcutDisplay keys={["Meta", "Shift", "Y"]} isMac={isMac} />
        for instant results.
      </>
    ),
    icon: MousePointerClick,
    color: "bg-brand-blue",
  },
  {
    title: "Build Your Dictionary",
    description: () => "Save words you want to learn. Review them later in this side panel to practice and memorize.",
    icon: BookOpen,
    color: "bg-brand-orange",
  },
  {
    title: "Customize Your Learning",
    description: () => "Set your target language, toggle voice pronunciation, and manage your preferences in Settings.",
    icon: Settings2,
    color: "bg-brand-pink",
  },
  {
    title: "Always Ready",
    description: (isMac: boolean) => (
      <>
        Access your dictionary anytime by clicking the extension icon or using
        <ShortcutDisplay keys={["Meta", "Shift", "L"]} isMac={isMac} />
      </>
    ),
    icon: PanelRightOpen,
    color: "bg-brand-purple",
  },
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    // Check platform
    setIsMac(navigator.platform.toUpperCase().indexOf('MAC') >= 0);
  }, []);

  const handleNext = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const StepIcon = STEPS[currentStep].icon;
  const stepDescription = STEPS[currentStep].description(isMac);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center p-6 bg-background text-foreground animate-in fade-in duration-500">
      <div className="w-full max-w-xs space-y-8">
        
        {/* Header / Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-brand-gradient bg-clip-text text-transparent">
            Welcome to Lexa
          </h1>
          <p className="text-sm text-muted-foreground max-w-[200px] mx-auto leading-tight">
            Your local AI translation sidekick.
          </p>
        </div>

        {/* Card Content */}
        <Card className="border-border shadow-lg overflow-hidden relative min-h-[350px] flex flex-col">
          <CardContent className="flex-1 p-6 flex flex-col items-center text-center pt-10 gap-6">
            
            {/* Animated Icon Circle */}
            <div className={cn(
              "h-20 w-20 rounded-2xl flex items-center justify-center shadow-inner transition-colors duration-500",
              STEPS[currentStep].color
            )}>
              <StepIcon className="text-white h-10 w-10" />
            </div>

            {/* Text Content */}
            <div className="space-y-2 animate-in slide-in-from-right-4 fade-in duration-300 w-full" key={currentStep}>
              <h2 className="text-lg font-semibold">{STEPS[currentStep].title}</h2>
              <div className="text-sm text-muted-foreground leading-relaxed">
                {stepDescription}
              </div>
            </div>

          </CardContent>

          {/* Footer Area with Progress and Buttons */}
          <div className="p-6 pt-0 flex flex-col gap-6">
            
            {/* Progress Indicators */}
            <div className="flex justify-center gap-2">
              {STEPS.map((_, idx) => (
                <div 
                  key={idx} 
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    idx === currentStep ? "w-6 bg-primary" : "w-1.5 bg-muted"
                  )}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                onClick={handleBack} 
                disabled={currentStep === 0}
                className="flex-1 font-semibold"
              >
                <ArrowLeft className="size-4 mr-2" />
                Back
              </Button>
              <Button 
                onClick={handleNext} 
                className="flex-1 font-semibold shadow-sm"
              >
                {currentStep === STEPS.length - 1 ? (
                  <span className="flex items-center gap-2">Start <Check className="size-4" /></span>
                ) : (
                  "Next"
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
