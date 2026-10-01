import { NOTES_SCHEMA_VERSION, validateStoredNotes } from "./noteSchema.js";

// In App.jsx, storage is window.localStorage: the browser's built-in storage API.
export const STORAGE_KEY = "fieldnotes.notes.v1";
const LEGACY_DEMO_PREFIX = "fieldnotes-demo-v1-";

export function loadNotes(storage) {
  const raw = storage.getItem(STORAGE_KEY);
  if (raw === null) return [];
  const notes = validateStoredNotes(JSON.parse(raw));
  const cleaned = notes.filter(
    (note) => !note.id.startsWith(LEGACY_DEMO_PREFIX),
  );
  if (cleaned.length !== notes.length) saveNotes(storage, cleaned);
  return cleaned;
}

export function saveNotes(storage, notes) {
  const data = { version: NOTES_SCHEMA_VERSION, notes };
  validateStoredNotes(data);
  storage.setItem(STORAGE_KEY, JSON.stringify(data));
}
