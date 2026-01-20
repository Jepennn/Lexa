import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { BookOpen, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Dictionary } from "@/types";

interface DictionarySelectionPopoverProps extends React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> {
  dictionaries: Dictionary[];
  onDictionarySelect: (id: string) => void;
  addedToDictionaryId: string | null;
}

//Extended componets for the popover shadcn/ui component so it can work within the shadow dom
export function DictionarySelectionPopover({
  dictionaries,
  onDictionarySelect,
  addedToDictionaryId,
  className,
  align = "end",
  sideOffset = 8,
  ...props
}: DictionarySelectionPopoverProps) {
  return (
    <PopoverPrimitive.Content
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "bg-card text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-40 rounded-md border border-border p-1 shadow-lg outline-none",
        className
      )}
      {...props}
    >
      <div className="mb-1 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground/70">
        Save to...
      </div>

      {dictionaries.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-3 px-2 text-center">
          <BookOpen className="mb-1.5 size-4 text-muted-foreground/40" />
          <p className="text-[10px] text-muted-foreground">No dictionaries found</p>
        </div>
      ) : (
        <div className="max-h-[130px] overflow-y-auto space-y-0.5 px-0.5 pr-1.5">
          {dictionaries.map((dictionary) => (
            <button
              key={dictionary.id}
              onClick={() => onDictionarySelect(dictionary.id)}
              className="w-full flex items-center gap-1.5 rounded-sm px-1.5 py-1 text-left text-[11px] hover:bg-accent hover:text-accent-foreground transition-colors group relative"
            >
              <div className={cn(
                "flex size-4.5 shrink-0 items-center justify-center rounded-sm bg-muted/50 text-muted-foreground group-hover:bg-background group-hover:text-primary transition-colors",
                addedToDictionaryId === dictionary.id && "bg-primary text-primary-foreground"
              )}>
                {addedToDictionaryId === dictionary.id ? (
                  <Check className="size-3" />
                ) : (
                  <BookOpen className="size-3" />
                )}
              </div>
              <span className="truncate flex-1 font-medium">
                {dictionary.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </PopoverPrimitive.Content>
  );
}
