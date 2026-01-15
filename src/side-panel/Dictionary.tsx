import { useState } from "react";
import { DictionaryList } from "./DictionaryList";
import { DictionaryDetail } from "./DictionaryDetail";
import type { Dictionary as DictionaryType } from "@/types";

export function Dictionary() {
  const [selectedDictionary, setSelectedDictionary] = useState<DictionaryType | null>(null);

  return (
    <div className="flex-1 h-full">
      {selectedDictionary ? (
        <DictionaryDetail 
          dictionaryId={selectedDictionary.id}
          dictionaryName={selectedDictionary.name}
          color={selectedDictionary.color}
          onBack={() => setSelectedDictionary(null)}
        />
      ) : (
        <DictionaryList onSelectDictionary={setSelectedDictionary} />
      )}
    </div>
  );
}