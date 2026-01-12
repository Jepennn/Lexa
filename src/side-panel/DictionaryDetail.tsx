import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ChevronLeft, 
  Plus, 
  Search, 
  Brain, 
  Settings2,
  Filter
} from "lucide-react";
import { WordCard, type WordItem } from "./WordCard";
import { AddWordForm, type NewWordData } from "./AddWordForm";

// Mock Data (Replace with real data later)
const MOCK_WORDS: WordItem[] = [
  {
    id: "1",
    original: "Hola",
    translation: "Hello",
    example: "Hola, ¿cómo estás?",
    isFavorite: true,
    createdAt: "2024-01-12",
  },
  {
    id: "2",
    original: "Gato",
    translation: "Cat",
    example: "El gato duerme en el sofá.",
    isFavorite: false,
    createdAt: "2024-01-13",
  },
  {
    id: "3",
    original: "Programación",
    translation: "Programming",
    isFavorite: true,
    createdAt: "2024-01-14",
  },
  {
    id: "4",
    original: "Desayuno",
    translation: "Breakfast",
    example: "Me gusta comer huevos para el desayuno.",
    isFavorite: false,
    createdAt: "2024-01-15",
  },
];

interface DictionaryDetailProps {
  dictionaryId: string;
  dictionaryName: string;
  color: string; // e.g., "bg-orange-500"
  onBack: () => void;
}

export function DictionaryDetail({ 
  dictionaryName, 
  color,
  onBack 
}: DictionaryDetailProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [words, setWords] = useState<WordItem[]>(MOCK_WORDS);
  const [isAddingWord, setIsAddingWord] = useState(false);

  const filteredWords = words.filter(
    (w) =>
      w.original.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleFavorite = (id: string) => {
    setWords(words.map(w => w.id === id ? { ...w, isFavorite: !w.isFavorite } : w));
  };

  const handleDelete = (id: string) => {
    setWords(words.filter(w => w.id !== id));
  };

  const handleAddWord = (data: NewWordData) => {
    const newWord: WordItem = {
      id: crypto.randomUUID(),
      ...data,
      isFavorite: false,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setWords([newWord, ...words]);
    setIsAddingWord(false);
  };

  if (isAddingWord) {
    return (
      <div className="flex flex-col h-full w-full bg-background p-4 dark text-foreground">
        <div className="flex items-center gap-3 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsAddingWord(false)}
            className="h-9 w-9 rounded-full hover:bg-muted text-primary"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <h2 className="text-xl font-bold tracking-tight text-primary">Add New Word</h2>
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
      <div className="flex flex-col gap-4 p-4 border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        
        {/* Navigation & Title */}
        <div className="flex items-center gap-3">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onBack}
            className="h-9 w-9 rounded-full hover:bg-muted text-primary"
          >
            <ChevronLeft className="size-5" />
          </Button>
          
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold tracking-tight truncate flex items-center gap-2 text-primary">
              <span className={`h-3 w-3 rounded-full ${color}`} />
              {dictionaryName}
            </h2>
            <p className="text-xs text-muted-foreground font-medium">
              {words.length} words • Last studied today
            </p>
          </div>

          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground">
            <Settings2 className="size-5" />
          </Button>
        </div>

        {/* Primary Actions Toolbar */}
        <div className="flex items-center gap-2">
          <Button 
            className="flex-1 h-9 shadow-xs gap-2 font-semibold"
            onClick={() => setIsAddingWord(true)}
          >
            <Plus className="size-4" />
            Add Word
          </Button>
          <Button variant="secondary" className="flex-1 h-9 shadow-xs gap-2 font-semibold text-primary bg-primary/10 hover:bg-primary/20 border-transparent">
            <Brain className="size-4" />
            Practice
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
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-3 pb-20">
          {filteredWords.length > 0 ? (
            filteredWords.map((word) => (
              <WordCard 
                key={word.id} 
                word={word} 
                onPlayAudio={(text) => console.log("Playing:", text)}
                onDelete={handleDelete}
                onToggleFavorite={handleToggleFavorite}
                onEdit={(id) => console.log("Edit:", id)}
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
