import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button.jsx";
import { Input } from "./ui/input.jsx";
import { Textarea } from "./ui/textarea.jsx";
import { Card, CardContent } from "./ui/card.jsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog.jsx";
import { formatLines, parseBody } from "@frontend/lib/notes/formatting";
import { highlightParts } from "@frontend/lib/notes/search";

function Highlight({ text, query }) {
  return highlightParts(text, query).map((part, i) =>
    part.match ? <mark key={i}>{part.text}</mark> : part.text,
  );
}

function NoteBody({ body, query }) {
  return (
    <div className="formatted-body">
      {parseBody(body).map((block, i) => {
        if (block.type === "heading")
          return (
            <h2 key={i}>
              <Highlight text={block.text} query={query} />
            </h2>
          );
        if (block.type === "subheading")
          return (
            <h3 key={i}>
              <Highlight text={block.text} query={query} />
            </h3>
          );
        if (block.type === "list")
          return (
            <ul key={i}>
              {block.items.map((item, j) => (
                <li key={j}>
                  <Highlight text={item} query={query} />
                </li>
              ))}
            </ul>
          );
        if (block.type === "space")
          return <div className="paragraph-space" key={i} />;
        return (
          <p key={i}>
            <Highlight text={block.text} query={query} />
          </p>
        );
      })}
    </div>
  );
}

export default function NotePage({ note, query, onSave, onDelete }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(note.title);
  const [body, setBody] = useState(note.body);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const bodyRef = useRef(null);

  function format(prefix) {
    const input = bodyRef.current;
    const result = formatLines(
      body,
      input.selectionStart,
      input.selectionEnd,
      prefix,
    );
    if (result.text.length > 50000) {
      setError("The note body can contain up to 50,000 characters.");
      return;
    }
    setBody(result.text);
    requestAnimationFrame(() => {
      input.focus();
      input.setSelectionRange(result.start, result.end);
    });
  }
  function save(event) {
    event.preventDefault();
    if (!title.trim() || !body.trim()) return;
    try {
      onSave(note.id, title.trim(), body.trim());
      setEditing(false);
      setError("");
      setMessage("Changes saved on this device.");
    } catch {
      setError(
        "Changes could not be saved. Your edits are still here. Check browser storage and try again.",
      );
    }
  }
  function cancel() {
    setTitle(note.title);
    setBody(note.body);
    setEditing(false);
    setError("");
  }

  return (
    <div className="app-shell reader-shell">
      <header className="topbar">
        <Link className="brand" href="/notes">
          <span className="brand-icon">✳</span> fieldnotes
          <span className="brand-dot">.</span>
        </Link>
        <span className="device-badge">MM CAR CARE CREW</span>
      </header>
      <main className="reader-main">
        <div className="reader-actions">
          <Button variant="ghost" asChild>
            <Link href="/notes">← Back to notes</Link>
          </Button>
          <div className="reader-action-buttons">
            {!editing && (
              <Button
                onClick={() => {
                  setTitle(note.title);
                  setBody(note.body);
                  setEditing(true);
                  setMessage("");
                }}
              >
                Edit note
              </Button>
            )}
            <Button variant="outline" onClick={() => setDeleting(true)}>
              Delete note
            </Button>
          </div>
        </div>
        <p className="eyebrow">
          YOUR NOTE · {new Date(note.createdAt).toLocaleDateString()}
        </p>
        {error && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        <p role="status" className="reader-status">
          {message}
        </p>
        {editing ? (
          <form className="note-editor" onSubmit={save}>
            <label htmlFor="edit-title">Title</label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={200}
              autoFocus
            />
            <label htmlFor="edit-body">Note content</label>
            <div
              className="format-toolbar"
              role="group"
              aria-label="Text formatting"
            >
              <Button
                variant="outline"
                type="button"
                onClick={() => format("# ")}
              >
                Heading
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => format("## ")}
              >
                Subheading
              </Button>
              <Button
                variant="outline"
                type="button"
                onClick={() => format("- ")}
              >
                Bullet points
              </Button>
              <Button variant="ghost" type="button" onClick={() => format("")}>
                Remove formatting
              </Button>
            </div>
            <p className="editor-hint" id="format-help">
              Select a line or several lines, then choose a format. Click the
              same format again to remove it. Add or delete text directly below.
            </p>
            <Textarea
              ref={bodyRef}
              id="edit-body"
              aria-describedby="format-help"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              maxLength={50000}
              required
            />
            <div className="editor-save">
              <Button type="submit" disabled={!title.trim() || !body.trim()}>
                Save changes
              </Button>
              <Button type="button" variant="outline" onClick={cancel}>
                Cancel edits
              </Button>
              <span>{body.length.toLocaleString()} / 50,000</span>
            </div>
            <Card className="preview-card">
              <CardContent>
                <p className="eyebrow">LIVE PREVIEW</p>
                <h1>{title || "Untitled note"}</h1>
                <NoteBody body={body} query="" />
              </CardContent>
            </Card>
          </form>
        ) : (
          <article>
            <h1 className="reader-title">
              <Highlight text={note.title} query={query} />
            </h1>
            <NoteBody body={note.body} query={query} />
          </article>
        )}
      </main>
      <Dialog open={deleting} onOpenChange={setDeleting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this note?</DialogTitle>
            <DialogDescription>
              This removes “{note.title}” from this browser. This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleting(false)}>
              Keep note
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                try {
                  onDelete(note.id);
                  router.push("/notes");
                } catch {
                  setDeleting(false);
                  setError(
                    "This note could not be deleted. Check browser storage and try again.",
                  );
                }
              }}
            >
              Delete permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
