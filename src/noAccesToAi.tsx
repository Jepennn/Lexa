import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export function NoAccessToAi() {
  const handleLearnMore = () => {
    // Open a new tab with detailed requirements information
    window.open("https://developer.chrome.com/docs/ai/built-in", "_blank");
  };

  return (
    <div className="flex h-full w-full items-center justify-center bg-background px-3 py-3">
      <div className="flex h-full w-full flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-[0_18px_45px_rgba(0,0,0,0.55)]">
        <Alert variant="destructive" className="border-destructive/50">
          <AlertCircle />
          <div className="col-start-2 space-y-3">
            <AlertTitle className="text-base mt-0">Translation API Not Found</AlertTitle>

            <AlertDescription>
              <p className="text-xs leading-relaxed">
                This extension requires Chrome's built-in AI features to work. Your environment does
                not fulfill all the requirements at the moment. Often it's just a small change that
                needs to be made to your environment to get it to work. Start by updating your
                Chrome browser to the latest version. If that doesn't work, then check out our get
                started guide to learn more.
              </p>

              <Button
                onClick={handleLearnMore}
                variant="outline"
                className="w-full h-9 text-[11px] font-semibold mt-3 border-none cursor-pointer"
              >
                Get Started Guide
              </Button>
            </AlertDescription>
          </div>
        </Alert>
      </div>
    </div>
  );
}
