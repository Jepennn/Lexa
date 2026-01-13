import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bot, ExternalLink, TriangleAlert } from "lucide-react";

export function NoAccessToAi() {
  const handleLearnMore = () => {
    window.open("https://developer.chrome.com/docs/ai/built-in", "_blank");
  };

  return (
    <div className="flex h-full w-full flex-col bg-background p-4 gap-4 items-center justify-center text-center">
      <div className="relative">
        <div className="h-12 w-12 bg-muted rounded-full flex items-center justify-center">
          <Bot className="size-6 text-foreground" />
        </div>
        <div className="absolute -bottom-1 -right-1 bg-background rounded-full p-0.5">
           <TriangleAlert className="size-4 text-amber-500 fill-amber-500/10" />
        </div>
      </div>

      <div className="space-y-1">
        <h3 className="font-semibold text-base tracking-tight">AI Features Unavailable</h3>
        <p className="text-xs text-muted-foreground leading-relaxed max-w-[240px] mx-auto">
          Chrome's built-in AI features are required for this extension. Please update Chrome or check the setup guide.
        </p>
      </div>

      <Card className="w-full p-1 border-border/60 shadow-sm bg-muted/20">
        <Button 
          onClick={handleLearnMore}
          variant="secondary"
          className="w-full h-8 text-xs gap-2 font-medium"
        >
          View Setup Guide
          <ExternalLink className="size-3 opacity-60" />
        </Button>
      </Card>
    </div>
  );
}

