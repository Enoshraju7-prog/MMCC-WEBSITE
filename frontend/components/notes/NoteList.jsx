import { memo, useCallback, useEffect, useRef } from "react";
import Link from "next/link";
import { useVirtualizer } from "@tanstack/react-virtual";
import { highlightParts } from "@frontend/lib/notes/search";
import { Card, CardContent } from "./ui/card.jsx";
import { Button } from "./ui/button.jsx";

function Highlight({ text, query }) {
  return highlightParts(text, query).map((part, index) =>
    part.match ? <mark key={index}>{part.text}</mark> : part.text,
  );
}

const dateFormat = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function NoteList({ notes, query }) {
  const scrollRef = useRef(null);
  const getItemKey = useCallback((index) => notes[index].id, [notes]);
  const virtualizer = useVirtualizer({
    count: notes.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => 190,
    getItemKey,
    overscan: 5,
  });
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0 });
  }, [query]);

  return (
    <div
      ref={scrollRef}
      className="note-scroll"
      tabIndex={0}
      aria-label="Notes. Scroll to read more notes."
    >
      <div
        role="list"
        className="virtual-list"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((row) => {
          const note = notes[row.index];
          return (
            <div
              role="listitem"
              key={note.id}
              data-index={row.index}
              ref={virtualizer.measureElement}
              className="note-row"
              style={{ transform: `translateY(${row.start}px)` }}
              aria-posinset={row.index + 1}
              aria-setsize={notes.length}
            >
              <Card className="note-card">
                <CardContent className="note-content">
                  <div className="note-meta">
                    <span>NOTE {String(row.index + 1).padStart(2, "0")}</span>
                    <time dateTime={new Date(note.createdAt).toISOString()}>
                      {dateFormat.format(note.createdAt)}
                    </time>
                  </div>
                  <h3>
                    <Highlight text={note.title} query={query} />
                  </h3>
                  <p className="note-body">
                    <Highlight text={note.body} query={query} />
                  </p>
                  <Button asChild variant="ghost" className="read-note">
                    <Link
                      href={`/notes/${encodeURIComponent(note.id)}${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ""}`}
                      aria-label={`Read note: ${note.title}`}
                    >
                      Read note ↗
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default memo(NoteList);
