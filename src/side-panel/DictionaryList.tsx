import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Search, Book, MoreHorizontal, ChevronRight, Languages, Sparkles, GraduationCap, Heart, Zap, Flag, Bookmark, Globe, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddDictionaryForm, type NewDictionaryData } from './AddDictionaryForm';

// Types
export interface DictionaryItem {
  id: string;
  name: string;
  description?: string;
  count: number;
  color: string; // Tailwind class for background
  icon: string;
  lastUsed?: string;
}

const MOCK_DICTIONARIES: DictionaryItem[] = [
  {
    id: "1",
    name: "Spanish Basics",
    description: "English → Spanish",
    count: 420,
    color: "bg-orange-500",
    icon: "globe",
    lastUsed: "2 mins ago"
  },
  {
    id: "2",
    name: "Tech Vocabulary",
    description: "Software Engineering terms",
    count: 85,
    color: "bg-blue-500",
    icon: "book",
    lastUsed: "1 day ago"
  },
  {
    id: "3",
    name: "Saved Phrases",
    description: "Useful daily expressions",
    count: 24,
    color: "bg-emerald-500",
    icon: "star",
    lastUsed: "5 days ago"
  },
    {
    id: "4",
    name: "Grammar Rules",
    description: "Important rules to remember",
    count: 12,
    color: "bg-purple-500",
    icon: "graduation",
    lastUsed: "1 week ago"
  }
];

const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'globe': return Globe;
    case 'graduation': return GraduationCap;
    case 'star': return Star;
    case 'heart': return Heart;
    case 'zap': return Zap;
    case 'flag': return Flag;
    case 'bookmark': return Bookmark;
    case 'book': 
    default: return Book;
  }
};

interface DictionaryListProps {
  onSelectDictionary?: (id: string) => void;
  className?: string;
}

export function DictionaryList({ onSelectDictionary, className }: DictionaryListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const filteredDictionaries = MOCK_DICTIONARIES.filter(dict => 
    dict.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    dict.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddSubmit = (data: NewDictionaryData) => {
    console.log("New Dictionary Data:", data);
    setIsAdding(false);
    // Here you would typically add the new dictionary to your state/backend
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
      <div className="flex-1 space-y-3 overflow-y-auto pb-6">
        {filteredDictionaries.length > 0 ? (
          filteredDictionaries.map((dict) => {
            const IconComponent = getIconComponent(dict.icon);
            return (
              <div 
                  key={dict.id}
                  onClick={() => onSelectDictionary?.(dict.id)}
                  className="group relative cursor-pointer"
              >
                  <Card className="rounded-2xl border-border/40 shadow-xs hover:bg-accent/30 hover:border-border/60 transition-all duration-200 active:scale-[0.99]">
                  <CardContent className="p-3.5 flex items-center gap-3.5">
                      {/* Icon Container - iOS Style */}
                      <div className={cn(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-inner",
                      dict.color
                      )}>
                      <IconComponent className="text-white size-4" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="flex items-center justify-between">
                          <span className="font-semibold text-base truncate text-foreground leading-tight">
                          {dict.name}
                          </span>
                          {dict.lastUsed && (
                          <span className="text-[10px] text-muted-foreground font-medium shrink-0 ml-2">
                              {dict.lastUsed}
                          </span>
                          )}
                      </div>
                      <div className="flex items-center gap-2">
                           <span className="text-xs text-muted-foreground truncate font-medium">
                          {dict.description}
                          </span>
                      </div>
                      </div>

                      {/* Chevron/Action */}
                      <div className="text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
                      <ChevronRight className="size-5" />
                      </div>
                  </CardContent>
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
                <p className="text-xs text-muted-foreground mt-1">Try searching for something else or create a new one.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
