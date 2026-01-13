import { ArrowRightLeft, PanelRightOpen, Settings, Power } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetUserSettings } from "@/hooks/useGetUserSettings";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// Map language codes to names (simplified)
const LANG_MAP: Record<string, string> = {
  sv: "Swedish",
  en: "English",
  fr: "French",
  es: "Spanish",
  ja: "Japanese",
};

function App() {
  const userSettings = useGetUserSettings();

  const openSidePanel = async () => {
    // Get the current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (tab?.id) {
      // Send message to background with the specific tab ID
      chrome.runtime.sendMessage({ 
        action: "OPEN_SIDE_PANEL", 
        tabId: tab.id 
      });
      // Close the popup
      window.close();
    }
  };

  const handleSwapLanguages = () => {
    if (!userSettings) return;
    chrome.storage.sync.set({
      sourceLang: userSettings.targetLang,
      targetLang: userSettings.sourceLang,
    });
  };

  // Safe access to language names
  const sourceName = userSettings ? LANG_MAP[userSettings.sourceLang] || userSettings.sourceLang.toUpperCase() : "...";
  const targetName = userSettings ? LANG_MAP[userSettings.targetLang] || userSettings.targetLang.toUpperCase() : "...";

  return (
    <div className="flex flex-col h-full w-full bg-background p-4 gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 bg-primary rounded-md flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-xs">L</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Learnly</span>
        </div>
        <div className="flex items-center gap-1">
             <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-full border border-green-500/20">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-[10px] font-medium text-green-600 dark:text-green-400">Active</span>
            </div>
        </div>
      </div>

      {/* Main Actions Card */}
      <Card className="p-4 flex flex-col gap-3 shadow-sm border-border/60">
        <div className="flex items-center justify-between gap-2">
           <div className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/30">
              <span className="text-xs text-muted-foreground font-medium mb-1">From</span>
              <span className="font-semibold text-sm">{sourceName}</span>
           </div>
           
           <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full shrink-0 hover:bg-muted text-muted-foreground"
            onClick={handleSwapLanguages}
           >
             <ArrowRightLeft className="size-4" />
           </Button>

           <div className="flex-1 flex flex-col items-center justify-center p-2 rounded-lg bg-secondary/30">
              <span className="text-xs text-muted-foreground font-medium mb-1">To</span>
              <span className="font-semibold text-sm">{targetName}</span>
           </div>
        </div>
      </Card>

      {/* Primary Action */}
      <Button 
        size="lg" 
        className="w-full h-12 text-sm font-semibold shadow-sm gap-2"
        onClick={openSidePanel}
      >
        <PanelRightOpen className="size-4" />
        Open Side Panel
      </Button>
      
      {/* Footer Info */}
      <p className="text-center text-[10px] text-muted-foreground/60">
        Select text on any page to translate instantly.
      </p>
    </div>
  );
}

export default App;