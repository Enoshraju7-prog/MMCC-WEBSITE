/**
 * NOTE SCHEMA — the shape of one note, not a database table.
 * This JavaScript app uses JSDoc for the model and runtime validation below.
 *
 * @typedef {Object} Note
 * @property {string} id Unique note ID (UUID for user notes).
 * @property {string} title Nonempty note title.
 * @property {string} body Nonempty content; formatting is stored as text.
 * @property {number} createdAt Creation time in milliseconds since the Unix epoch.
 * @property {number} [updatedAt] Last edit time, when the note has been edited.
 */

/**
 * STORAGE SCHEMA — the JSON object saved under fieldnotes.notes.v1.
 * @typedef {Object} StoredNotes
 * @property {1} version Storage format version.
 * @property {Note[]} notes The saved collection.
 */

export const NOTES_SCHEMA_VERSION = 1;

function isTimestamp(value) {
  return Number.isFinite(value) && Number.isFinite(new Date(value).getTime());
}

/** Validate untrusted parsed JSON before the app renders it. */
export function validateStoredNotes(data) {
  if (
    !data ||
    data.version !== NOTES_SCHEMA_VERSION ||
    !Array.isArray(data.notes)
  ) {
    throw new Error("Invalid saved notes");
  }
  const ids = new Set();
  for (const note of data.notes) {
    if (
      !note ||
      typeof note.id !== "string" ||
      !note.id.trim() ||
      ids.has(note.id) ||
      typeof note.title !== "string" ||
      !note.title.trim() ||
      typeof note.body !== "string" ||
      !note.body.trim() ||
      !isTimestamp(note.createdAt) ||
      (note.updatedAt !== undefined && !isTimestamp(note.updatedAt))
    ) {
      throw new Error("Invalid saved note");
    }
    ids.add(note.id);
  }
  return data.notes;
}
