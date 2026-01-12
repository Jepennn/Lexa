import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Volume2, 
  Trash2, 
  Pencil,
  Star
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface WordItem {
  id: string;
  original: string;
  translation: string;
  example?: string;
  isFavorite?: boolean;
  createdAt: string;
}

interface WordCardProps {
  word: WordItem;
  onPlayAudio?: (text: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export function WordCard({ 
  word, 
  onPlayAudio, 
  onEdit, 
  onDelete,
  onToggleFavorite 
}: WordCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-md border-border/60 hover:border-primary/30"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start gap-3">
          {/* Main Content */}
          <div className="flex-1 space-y-1">
            <h3 className="text-lg font-semibold text-foreground leading-tight">
              {word.translation}
            </h3>
            <p className="text-sm text-muted-foreground font-medium">
              {word.original}
            </p>
            
            {word.example && (
              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-xs text-muted-foreground/80 italic line-clamp-2">
                  "{word.example}"
                </p>
              </div>
            )}
          </div>

          {/* Actions Column */}
          <div className="flex flex-col gap-1 items-end">
             {/* Audio Button */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full"
              onClick={() => onPlayAudio?.(word.translation)}
            >
              <Volume2 className="size-4" />
              <span className="sr-only">Play audio</span>
            </Button>

             {/* Favorite Toggle (Visible on hover or if active) */}
             <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-full transition-opacity duration-200",
                  word.isFavorite ? "text-amber-400 opacity-100" : "text-muted-foreground/40 hover:text-amber-400 opacity-0 group-hover:opacity-100"
                )}
                onClick={() => onToggleFavorite?.(word.id)}
              >
                <Star className={cn("size-4", word.isFavorite && "fill-current")} />
                <span className="sr-only">Toggle favorite</span>
              </Button>
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
              <DropdownMenuItem onClick={() => onEdit?.(word.id)} className="gap-2">
                <Pencil className="size-3.5" /> Edit
              </DropdownMenuItem>
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
