import { useState } from "react";
import { DictionaryList, type DictionaryItem } from "./DictionaryList";
import { DictionaryDetail } from "./DictionaryDetail";

export function Dictionary() {
  const [selectedDictionary, setSelectedDictionary] = useState<DictionaryItem | null>(null);

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