import test from "node:test";
import assert from "node:assert/strict";
import { loadNotes, saveNotes, STORAGE_KEY } from "./storage.js";
import { highlightParts, indexNotes, searchNotes } from "./search.js";
import { formatLines, parseBody } from "./formatting.js";

const notes = [
  {
    id: "one",
    title: "Meeting ideas",
    body: "Bring the React prototype. Literal [brackets].",
    createdAt: 1000,
  },
];
function memoryStorage() {
  const data = new Map();
  return {
    getItem: (key) => data.get(key) ?? null,
    setItem: (key, value) => data.set(key, value),
  };
}

test("notes survive a JSON storage round trip", () => {
  const storage = memoryStorage();
  assert.deepEqual(loadNotes(storage), []);
  saveNotes(storage, notes);
  assert.deepEqual(loadNotes(storage), notes);
});
test("invalid storage is rejected without modifying it", () => {
  for (const raw of [
    "{bad",
    "null",
    JSON.stringify({
      version: 1,
      notes: [{ ...notes[0], updatedAt: "invalid" }],
    }),
    JSON.stringify({ version: 1, notes: [{ id: "bad" }] }),
    JSON.stringify({ version: 1, notes: [...notes, ...notes] }),
  ]) {
    const storage = memoryStorage();
    storage.setItem(STORAGE_KEY, raw);
    assert.throws(() => loadNotes(storage));
    assert.equal(storage.getItem(STORAGE_KEY), raw);
  }
});
test("storage failures propagate so the form can retain its draft", () => {
  assert.throws(
    () =>
      saveNotes(
        {
          setItem() {
            throw new Error("Quota exceeded");
          },
        },
        notes,
      ),
    /Quota exceeded/,
  );
});
test("search matches titles and bodies regardless of case and trims query edges", () => {
  const indexed = indexNotes(notes);
  assert.equal(searchNotes(indexed, " meeting ").length, 1);
  assert.equal(searchNotes(indexed, "REACT").length, 1);
  assert.equal(searchNotes(indexed, "missing").length, 0);
  assert.equal(searchNotes(indexed, "   ").length, 1);
});
test("highlights repeated literal matches while preserving every character", () => {
  const input = "A [test] and [TEST]. <script>alert(1)</script>";
  const parts = highlightParts(input, "[test]");
  assert.equal(parts.filter((part) => part.match).length, 2);
  assert.equal(parts.map((part) => part.text).join(""), input);
  assert.deepEqual(highlightParts("abc", ""), [{ text: "abc", match: false }]);
});
test("search handles a 10,000-note collection", () => {
  const indexed = indexNotes(
    Array.from({ length: 10000 }, (_, index) => ({
      ...notes[0],
      id: String(index),
      title: `Note ${index}`,
    })),
  );
  assert.equal(searchNotes(indexed, "Note 9999").length, 1);
  assert.equal(searchNotes(indexed, "react").length, 10000);
});

test("Unicode case folding preserves original text and match positions", () => {
  const parts = highlightParts("İstanbul React 🌿", "react");
  assert.equal(parts.map((part) => part.text).join(""), "İstanbul React 🌿");
  assert.deepEqual(
    parts.filter((part) => part.match),
    [{ text: "React", match: true }],
  );
});

test("legacy generated demo notes are removed while crew notes are preserved", () => {
  const storage = memoryStorage();
  saveNotes(storage, [
    notes[0],
    {
      id: "fieldnotes-demo-v1-0001",
      title: "Generated sample",
      body: "This is not a crew note.",
      createdAt: 999,
    },
  ]);
  assert.deepEqual(loadNotes(storage), notes);
  assert.deepEqual(JSON.parse(storage.getItem(STORAGE_KEY)).notes, notes);
});

test("formatting applies and removes headings or bullets on selected lines", () => {
  const text = "First line\nSecond line\nThird line";
  const formatted = formatLines(text, 0, 21, "- ");
  assert.equal(formatted.text, "- First line\n- Second line\nThird line");
  assert.equal(formatLines(formatted.text, 0, formatted.end, "- ").text, text);
  assert.equal(formatLines("## Title", 0, 8, "# ").text, "# Title");
});

test("formatted body groups bullets and keeps HTML-looking content as text", () => {
  assert.deepEqual(
    parseBody("# Heading\n## Subheading\n- One\n- Two\n<script>"),
    [
      { type: "heading", text: "Heading" },
      { type: "subheading", text: "Subheading" },
      { type: "list", items: ["One", "Two"] },
      { type: "paragraph", text: "<script>" },
    ],
  );
});
