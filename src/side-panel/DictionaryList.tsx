import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Book,
  ChevronRight,
  GraduationCap,
  Heart,
  Zap,
  Flag,
  Bookmark,
  Globe,
  Star,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AddDictionaryForm, type NewDictionaryData } from "./AddDictionaryForm";
import { getDictionaries, createDictionary, deleteDictionary } from "@/lib/storage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/sonner";
import type { Dictionary, DictionaryIcon, DictionaryColor } from "@/types";

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case "globe":
      return Globe;
    case "graduation":
      return GraduationCap;
    case "star":
      return Star;
    case "heart":
      return Heart;
    case "zap":
      return Zap;
    case "flag":
      return Flag;
    case "bookmark":
      return Bookmark;
    case "book":
    default:
      return Book;
  }
};

interface DictionaryListProps {
  onSelectDictionary?: (item: Dictionary) => void;
  className?: string;
}

export function DictionaryList({ onSelectDictionary, className }: DictionaryListProps) {
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDictionaries();
  }, []);

  const loadDictionaries = async () => {
    setIsLoading(true);
    try {
      const data = await getDictionaries();
      setDictionaries(data);
    } catch (error) {
      console.error("Failed to load dictionaries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredDictionaries = dictionaries.filter(
    (dict) =>
      dict.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dict.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = async (data: NewDictionaryData) => {
    try {
      await createDictionary(
        data.name,
        data.description,
        data.icon as DictionaryIcon,
        data.color as DictionaryColor
      );
      await loadDictionaries();
      setIsAdding(false);
      toast.success("Dictionary created successfully");
    } catch  {
      toast.error("Failed to create dictionary");
    }
  };

  const handleDeleteDictionary = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await deleteDictionary(id);
      await loadDictionaries();
      toast.success("Dictionary deleted");
    } catch {
      toast.error("Failed to delete dictionary");
    }
  };

  if (isAdding) {
    return (
      <AddDictionaryForm
        onSubmit={handleAddSubmit}
        onCancel={() => setIsAdding(false)}
        className={className}
      />
    );
  }

  return (
    <div className={cn("flex flex-col h-full w-full bg-background", className)}>
      {/* Header Section */}
      <div className="flex items-center justify-between px-1 py-4 mb-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Dictionaries</h2>
          <p className="text-xs text-muted-foreground font-medium">Manage your collections</p>
        </div>
        <Button
          size="icon"
          className="rounded-full h-9 w-9 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={() => setIsAdding(true)}
        >
          <Plus className="size-5" />
          <span className="sr-only">Add Dictionary</span>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70">
          <Search className="size-4" />
        </div>
        <Input
          className="pl-9 h-11 rounded-xl bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50 text-base text-foreground"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Dictionary List */}
      <div className="flex-1 space-y-3 overflow-y-auto scrollbar-dark pb-6">
        {isLoading ? (
          <div className="flex justify-center py-10">
            <p className="text-sm text-muted-foreground">Loading dictionaries...</p>
          </div>
        ) : filteredDictionaries.length > 0 ? (
          filteredDictionaries.map((dict) => {
            const IconComponent = getIconComponent(dict.icon);
            return (
              <div
                key={dict.id}
                onClick={() => onSelectDictionary?.(dict)}
                className="group relative cursor-pointer"
              >
                <Card className="rounded-2xl border-border/40 shadow-xs hover:bg-accent/30 hover:border-border/60 transition-all duration-200 active:scale-[0.99]">
                  <CardContent className="p-3.5 flex items-center gap-3.5">

                    <div
                      className={cn(
                        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-inner",
                        dict.color
                      )}
                    >
                      <IconComponent className="text-white size-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex flex-col items-start justify-between">
                        <span className="font-semibold text-base truncate text-foreground leading-tight">
                          {dict.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground truncate font-medium">
                          {dict.description}
                        </span>
                      </div>
                    </div>


                    <div className="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
                      <ChevronRight className="size-5" />
                    </div>
                  </CardContent>

                   {/* Absolute Positioned Menu (Top Right) */}
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-6 w-6 rounded-full bg-background/80 backdrop-blur-sm shadow-sm hover:bg-background ring-offset-0 focus-visible:ring-0 focus-visible:outline-none"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="size-3.5" />
                            <span className="sr-only">More options</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem 
                            onClick={(e) => handleDeleteDictionary(e, dict.id)} 
                            className="gap-2 text-destructive focus:text-destructive cursor-pointer"
                          >
                            <Trash2 className="size-3.5" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                </Card>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center space-y-3">
            <div className="bg-muted/50 p-4 rounded-full">
              <Search className="size-6 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">No dictionaries found</p>
              <p className="text-xs text-muted-foreground mt-1">
                Try searching for something else or create a new one.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
