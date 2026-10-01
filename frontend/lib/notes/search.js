export function indexNotes(notes) {
  return notes.map((note) => ({
    ...note,
    searchText: `${note.title}\n${note.body}`.toLowerCase(),
  }));
}

export function searchNotes(notes, query) {
  const needle = query.trim().toLowerCase();
  return needle
    ? notes.filter((note) => note.searchText.includes(needle))
    : notes;
}

// Literal matching: punctuation such as [ or * never becomes a regular expression.
export function highlightParts(text, query) {
  const needle = query.trim().toLowerCase();
  if (!needle) return [{ text, match: false }];
  // Some characters expand when lowercased (İ → i + combining dot).
  // Map folded offsets back to the original string to preserve the text.
  let lower = "";
  const offsets = [];
  let originalOffset = 0;
  for (const character of text) {
    const folded = character.toLowerCase();
    for (let index = 0; index < folded.length; index++)
      offsets.push(originalOffset);
    lower += folded;
    originalOffset += character.length;
  }
  offsets.push(text.length);
  const parts = [];
  let cursor = 0;
  let start = lower.indexOf(needle);
  while (start !== -1) {
    const originalStart = offsets[start];
    const lastOffset = offsets[start + needle.length - 1];
    const originalEnd =
      lastOffset + String.fromCodePoint(text.codePointAt(lastOffset)).length;
    if (originalStart > cursor)
      parts.push({ text: text.slice(cursor, originalStart), match: false });
    if (originalEnd > cursor)
      parts.push({
        text: text.slice(Math.max(cursor, originalStart), originalEnd),
        match: true,
      });
    cursor = originalEnd;
    start = lower.indexOf(needle, start + needle.length);
  }
  if (cursor < text.length)
    parts.push({ text: text.slice(cursor), match: false });
  return parts;
}
