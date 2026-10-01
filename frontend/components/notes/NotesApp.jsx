"use client";

import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import NoteList from "@frontend/components/notes/NoteList";
import NotePage from "@frontend/components/notes/NotePage";
import { loadNotes, saveNotes } from "@frontend/lib/notes/storage";
import { indexNotes, searchNotes } from "@frontend/lib/notes/search";
import { Input } from "@frontend/components/notes/ui/input";
import { Textarea } from "@frontend/components/notes/ui/textarea";
import { Button } from "@frontend/components/notes/ui/button";

export default function NotesApp({ noteId = "", initialQuery = "" }) {
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [storageError, setStorageError] = useState("");
  const [storageReady, setStorageReady] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [query, setQuery] = useState(initialQuery);
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");
  const titleRef = useRef(null);
  const deferredQuery = useDeferredValue(query);
  const indexed = useMemo(() => indexNotes(notes), [notes]);
  const results = useMemo(
    () => searchNotes(indexed, deferredQuery),
    [indexed, deferredQuery],
  );
  const isSearching = query !== deferredQuery;
  const canSave = title.trim() && body.trim() && storageReady && !storageError;

  useEffect(() => {
    try {
      setNotes(loadNotes(window.localStorage));
    } catch {
      setStorageError(
        "Saved notes could not be read. Your existing storage has been left untouched. Repair the saved data, then reload to continue.",
      );
    } finally {
      setStorageReady(true);
    }
  }, []);
  function addNote(event) {
    event.preventDefault();
    if (!canSave) return;
    const next = [
      {
        id: crypto.randomUUID(),
        title: title.trim(),
        body: body.trim(),
        createdAt: Date.now(),
      },
      ...notes,
    ];
    try {
      saveNotes(window.localStorage, next);
      setNotes(next);
      setTitle("");
      setBody("");
      setSaveError("");
      setMessage("Note saved on this device.");
      titleRef.current?.focus();
    } catch {
      setSaveError(
        "Your note could not be saved. Device storage may be full or unavailable. Your draft is still here.",
      );
    }
  }

  function saveEditedNote(id, updatedTitle, updatedBody) {
    const next = notes.map((note) =>
      note.id === id
        ? {
            ...note,
            title: updatedTitle,
            body: updatedBody,
            updatedAt: Date.now(),
          }
        : note,
    );
    saveNotes(window.localStorage, next);
    setNotes(next);
  }

  function deleteNote(id) {
    const next = notes.filter((note) => note.id !== id);
    saveNotes(window.localStorage, next);
    setNotes(next);
  }

  async function logOut() {
    await fetch("/api/notes/session", { method: "DELETE" });
    router.replace("/notes/login");
    router.refresh();
  }

  if (!storageReady) {
    return (
      <main className="login-shell" aria-live="polite">
        <p className="eyebrow">OPENING CREW NOTES…</p>
      </main>
    );
  }

  if (noteId) {
    const note = notes.find((item) => item.id === noteId);
    if (note) {
      return (
        <NotePage
          key={note.id}
          note={note}
          query={initialQuery}
          onSave={saveEditedNote}
          onDelete={deleteNote}
        />
      );
    }
    return (
      <div className="app-shell">
        <header className="topbar">
          <a className="brand" href="/notes">
            <span className="brand-icon">✳</span> fieldnotes
            <span className="brand-dot">.</span>
          </a>
        </header>
        <main className="missing-note">
          <h1>Note not found</h1>
          <p>{storageError || "This note may have been deleted on this device."}</p>
          <Button asChild>
            <a href="/notes">Back to notes</a>
          </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="/notes" aria-label="Fieldnotes home">
          <span className="brand-icon">✳</span> fieldnotes
          <span className="brand-dot">.</span>
        </a>
        <div className="crew-tools">
          <span className="device-badge">
            <span className="status-dot" /> MM CAR CARE CREW
          </span>
          <Button variant="ghost" size="sm" type="button" onClick={logOut}>
            Sign out
          </Button>
        </div>
      </header>
      <main>
        <section className="intro">
          <div>
            <p className="eyebrow">LESS NOISE. MORE ROOM FOR IDEAS.</p>
            <h1>
              A little space to think<span>.</span>
            </h1>
            <p className="intro-copy">
              Catch a thought, keep an idea, find it when you need it.
            </p>
          </div>
          <div className="total">
            <strong>{notes.length.toLocaleString()}</strong>
            <span>
              {notes.length === 1 ? "note collected" : "notes collected"}
            </span>
          </div>
        </section>
        {storageError && (
          <p role="alert" className="error">
            {storageError}
          </p>
        )}
        <div className="workspace">
          <aside className="composer">
            <div className="section-heading">
              <span className="eyebrow">A FRESH PAGE</span>
              <span aria-hidden="true">↗</span>
            </div>
            <h2>What’s on your mind?</h2>
            <p className="muted">Big ideas. Small reminders. Anything goes.</p>
            <form onSubmit={addNote}>
              <label htmlFor="title">
                Title <span>required</span>
              </label>
              <Input
                ref={titleRef}
                id="title"
                placeholder="Give your thought a name"
                value={title}
                maxLength={200}
                required
                onChange={(event) => {
                  setTitle(event.target.value);
                  setMessage("");
                }}
              />
              <label htmlFor="body">
                Your note <span>required</span>
              </label>
              <Textarea
                id="body"
                placeholder="Start writing here…"
                value={body}
                maxLength={50000}
                required
                onChange={(event) => {
                  setBody(event.target.value);
                  setMessage("");
                }}
              />
              <div className="draft-footer">
                <span>Stored only in this browser.</span>
                <span>{body.length.toLocaleString()} / 50,000</span>
              </div>
              <Button className="save-button" disabled={!canSave} type="submit">
                <span aria-hidden="true">＋</span> Save note{" "}
                <span aria-hidden="true">↗</span>
              </Button>
              <p className="save-status" role="status">
                {message}
              </p>
              {saveError && (
                <p role="alert" className="error">
                  {saveError}
                </p>
              )}
            </form>
            <div className="privacy">
              <span aria-hidden="true">◈</span>
              <p>
                <strong>Private access, device-local notes.</strong>
                <br />
                The page requires the crew password. Notes stay in this browser
                and do not sync to other devices or crew members.
              </p>
            </div>
          </aside>
          <section className="collection" aria-labelledby="collection-heading">
            <div className="collection-heading">
              <h2 id="collection-heading">
                Your collection <span>{notes.length}</span>
              </h2>
              <span className="muted">Newest first</span>
            </div>
            <div className="search-box">
              <span aria-hidden="true">⌕</span>
              <Input
                type="search"
                aria-label="Search note titles and bodies"
                placeholder="Find a thought, a word, an idea…"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              {query && (
                <Button
                  variant="ghost"
                  size="icon"
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  ×
                </Button>
              )}
            </div>
            <div className="results-bar" role="status" aria-live="polite">
              <span>
                {isSearching
                  ? "Searching…"
                  : `${results.length.toLocaleString()} ${results.length === 1 ? "note" : "notes"}${deferredQuery.trim() ? ` matching “${deferredQuery.trim()}”` : " in your collection"}`}
              </span>
              <span className="list-label">☰ LIST VIEW</span>
            </div>
            {results.length ? (
              <NoteList notes={results} query={deferredQuery} />
            ) : (
              <div className="empty-state">
                <div className="empty-icon" aria-hidden="true">
                  {deferredQuery.trim() ? "⌕" : "✎"}
                </div>
                <h3>
                  {deferredQuery.trim()
                    ? "No matching thoughts. Yet."
                    : "Good ideas start with a blank page."}
                </h3>
                <p>
                  {deferredQuery.trim()
                    ? "Try another word. We search both titles and note content."
                    : "Write your first note, and it will find a home right here."}
                </p>
                {deferredQuery.trim() && (
                  <Button
                    variant="ghost"
                    className="text-button"
                    onClick={() => setQuery("")}
                  >
                    Clear search ↗
                  </Button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
      <footer>
        <span>MM CAR CARE · CREW NOTES</span>
        <span>A little more clarity, one note at a time.</span>
      </footer>
    </div>
  );
}
