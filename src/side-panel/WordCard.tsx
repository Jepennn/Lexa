import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Trash2, 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { DictionaryEntry } from "@/types";

interface WordCardProps {
  word: DictionaryEntry;
  onDelete?: (id: string) => void;
}

export function WordCard({ 
  word, 
  onDelete,
}: WordCardProps) {

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-md border-border/60 hover:border-primary/30"
     >
      <CardContent className="p-6">
        <div className="flex justify-between items-center gap-3">
          {/* Main Content */}
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-semibold text-foreground leading-tight">
              {word.translation}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {word.text}
            </p>
          </div>

   
        </div>

        {/* Absolute Positioned Menu (Top Right) */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm shadow-sm">
                <MoreHorizontal className="size-3.5" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem 
                onClick={() => onDelete?.(word.id)} 
                className="gap-2 text-destructive focus:text-destructive"
              >
                <Trash2 className="size-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
}
