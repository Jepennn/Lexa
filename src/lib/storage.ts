import type {
  Dictionary,
  DictionaryEntry,
  DictionariesStorage,
  DictionaryColor,
  DictionaryIcon,
} from "@/types";

const DICTIONARIES_KEY = "dictionaries";

/**
 * Generate a unique ID
 */
function generateId(): string {
  // Prefer modern, collision-resistant IDs when available (Chrome supports this).
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  // Fallback: time + random (avoid deprecated `substr()`).
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2)}`;
}

/**
 * Get all dictionaries
 */
export async function getDictionaries(): Promise<Dictionary[]> {
  const result = await chrome.storage.local.get(DICTIONARIES_KEY);

  if (result[DICTIONARIES_KEY] === undefined || result[DICTIONARIES_KEY] === null) {
    return [] as Dictionary[];
  }

  const dictionaries: DictionariesStorage = result[DICTIONARIES_KEY] as DictionariesStorage;

  return Object.values(dictionaries).sort((a, b) => b.updatedAt - a.updatedAt);
}

/**
 * Create a new dictionary
 * @param name - The name of the dictionary
 * @param description - The description of the dictionary
 * @param icon - The icon of the dictionary
 * @param color - The color of the dictionary
 * @returns The new dictionary
 */
export async function createDictionary(
  name: string,
  description: string,
  icon: DictionaryIcon,
  color: DictionaryColor
): Promise<Dictionary> {
  const result = await chrome.storage.local.get(DICTIONARIES_KEY);

  let dictionaries = result[DICTIONARIES_KEY] as DictionariesStorage | undefined | null;

  if (dictionaries === undefined || dictionaries === null) {
    dictionaries = {} as DictionariesStorage;
  }

  const newDictionary: Dictionary = {
    id: generateId(),
    name,
    description,
    icon,
    color,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };

  dictionaries[newDictionary.id] = newDictionary;
  await chrome.storage.local.set({ [DICTIONARIES_KEY]: dictionaries });

  return newDictionary;
}

/**
 * Delete a dictionary and all its entries
 */
export async function deleteDictionary(id: string): Promise<void> {
  const result = await chrome.storage.local.get(DICTIONARIES_KEY);

  let dictionaries = result[DICTIONARIES_KEY] as DictionariesStorage | undefined | null;

  if (dictionaries === undefined || dictionaries === null) {
    dictionaries = {} as DictionariesStorage;
  }

  if (dictionaries[id]) {
    delete dictionaries[id];
    await chrome.storage.local.set({ [DICTIONARIES_KEY]: dictionaries });

    // Also remove all the entries for this repository
    await chrome.storage.local.remove(`entries_${id}`);
  }
}

/**
 * Get entries for a specific dictionary
 */
export async function getEntries(dictionaryId: string): Promise<DictionaryEntry[]> {
  const key = `entries_${dictionaryId}`;
  const result = await chrome.storage.local.get(key);

  // If no entries are found, return an empty array
  if (result[key] === undefined || result[key] === null) {
    return [] as DictionaryEntry[];
  }

  // Sort by createdAt
  const entries: DictionaryEntry[] = result[key] as DictionaryEntry[];
  return entries.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Add an entry to a dictionary
 * @param dictionaryId - The ID of the dictionary
 * @param text - The text of the entry
 * @param translation - The translation of the entry
 * @returns The new entry
 */
export async function addEntry(
  dictionaryId: string,
  text: string,
  translation: string
): Promise<DictionaryEntry> {
  const key = `entries_${dictionaryId}`;

  //Get both the dictionary data and the entries for this dictionary
  const result = await chrome.storage.local.get([DICTIONARIES_KEY, key]);

  // 1. Update the dictionary's "updatedAt" timestamp
  const dictionaries: DictionariesStorage =
    (result[DICTIONARIES_KEY] as DictionariesStorage | undefined) ?? ({} as DictionariesStorage);
  if (dictionaries[dictionaryId]) {
    dictionaries[dictionaryId].updatedAt = Date.now();
    await chrome.storage.local.set({ [DICTIONARIES_KEY]: dictionaries });
  }

  // 2. Add the new entry
  const entries: DictionaryEntry[] = (result[key] as DictionaryEntry[] | undefined) ?? [];
  const newEntry: DictionaryEntry = {
    id: generateId(),
    dictionaryId,
    text,
    translation,
    createdAt: Date.now(),
  };

  const updatedEntries = [newEntry, ...entries];
  await chrome.storage.local.set({ [key]: updatedEntries });

  return newEntry;
}

/**
 * Delete a specific entry
 */
export async function deleteEntry(dictionaryId: string, entryId: string): Promise<void> {
  const key = `entries_${dictionaryId}`;
  const result = await chrome.storage.local.get(key);
  const entries: DictionaryEntry[] = (result[key] as DictionaryEntry[] | undefined) ?? [];

  const updatedEntries = entries.filter((entry) => entry.id !== entryId);
  await chrome.storage.local.set({ [key]: updatedEntries });
}
