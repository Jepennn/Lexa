import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Search, 
  Filter,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { WordCard } from "./WordCard";
import { AddWordForm, type NewWordData } from "./AddWordForm";
import { getEntries, addEntry, deleteEntry } from "@/lib/storage";
import { toast } from "@/components/ui/sonner";
import type { DictionaryEntry } from "@/types";

interface DictionaryDetailProps {
  dictionaryId: string;
  dictionaryName: string;
  color: string; // e.g., "bg-orange-500"
  onBack: () => void;
}

export function DictionaryDetail({ 
  dictionaryId,
  dictionaryName, 
  color,
  onBack 
}: DictionaryDetailProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [words, setWords] = useState<DictionaryEntry[]>([]);
  const [isAddingWord, setIsAddingWord] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadWords = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const entries = await getEntries(dictionaryId);
      setWords(entries);
    } catch {
      setError("Failed to load words. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWords();
  }, [dictionaryId]);

  const filteredWords = words.filter(
    (w) =>
      w.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Delete a word from the dictionary
  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(dictionaryId, id);
      await loadWords();
      toast.success("Word deleted");
    } catch (error) {
      console.error("Failed to delete word:", error);
      toast.error("Failed to delete word");
    }
  };

  // Add a new word to the dictionary
  const handleAddWord = async (data: NewWordData) => {
    try {
      await addEntry(dictionaryId, data.original, data.translation);
      await loadWords();
      setIsAddingWord(false);
      toast.success("Word added successfully");
    } catch (error) {
      console.error("Failed to add word:", error);
      toast.error("Failed to add word");
    }
  };

  if (isAddingWord) {
    return (
      <div className="flex flex-col h-full w-full bg-background dark text-foreground">
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsAddingWord(false)}
            className="text-muted-foreground -ml-2"
          >
            ← Back
          </Button>
        </div>
        <AddWordForm 
          onSubmit={handleAddWord} 
          onCancel={() => setIsAddingWord(false)} 
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-background dark text-foreground">
      {/* --- Sticky Header & Toolbar --- */}

      <span>
        <Button
          variant="ghost"
          
          size="sm"
          onClick={onBack}
          className="text-muted-foreground"
        >
          ← Back
        </Button>
      </span>

      <div className="flex flex-col gap-4 p-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        {/* Navigation & Title */}
        <div className="flex items-center justify-between w-full">        
          <div className="flex-1 min-w-0 ">
            <h2 className="text-xl font-bold tracking-tight truncate text-center flex items-center gap-2 text-primary">
              <span className={`h-3 w-3 rounded-full ${color}`} />
              {dictionaryName}
            </h2>
          </div>
        </div>

        {/* Primary Actions Toolbar */}
        <div className="flex items-center ">
          <Button 
            className="flex-1 h-9 shadow-xs gap-2 font-semibold"
            onClick={() => setIsAddingWord(true)}
          >
            <Plus className="size-4" />
            Add Word
          </Button>
        </div>

        {/* Search & Filter */}
        <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/70">
              <Search className="size-4" />
            </div>
            <Input 
              className="pl-9 h-10 rounded-xl bg-secondary/30 border-none focus-visible:ring-1 focus-visible:ring-primary/50"
              placeholder="Search words..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
               <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground/70 hover:text-foreground">
                 <Filter className="size-3.5" />
               </Button>
            </div>
        </div>
      </div>

      {/* --- Scrollable Content --- */}
      <div className="flex-1 overflow-y-auto scrollbar-dark">
        <div className="p-4 space-y-3 pb-20">
          {isLoading ? (
             <div className="flex justify-center py-10">
               <p className="text-sm text-muted-foreground">Loading words...</p>
             </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-4">
              <AlertCircle className="size-8 text-destructive/80" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">{error}</p>
                <p className="text-xs">Check your connection and try again.</p>
              </div>
              <Button variant="outline" size="sm" onClick={loadWords} className="gap-2">
                <RefreshCw className="size-3.5" />
                Retry
              </Button>
            </div>
          ) : filteredWords.length > 0 ? (
            filteredWords.map((word) => (
              <WordCard 
                key={word.id} 
                word={word} 
                onPlayAudio={(text) => console.log("Playing:", text)}
                onDelete={handleDelete}
              />
            ))
          ) : (
             <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground space-y-2 opacity-60">
                <Search className="size-8 mb-2" />
                <p>No words found.</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
