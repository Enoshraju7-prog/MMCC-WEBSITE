# MM Car Care crew notes

The private notes workspace is served at `/notes`. Access is enforced by a
signed, server-verified HttpOnly session. The login password is verified only
on the server and never shipped in the browser bundle.

Notes use versioned browser-local storage under `fieldnotes.notes.v1`. They
persist after reload in the same browser, but they do not sync between devices
or crew members. Clearing browser site data removes them.

Old generated sample notes with IDs beginning `fieldnotes-demo-v1-` are removed
once when storage loads. Real crew notes are preserved. Fresh browsers start
with an empty collection.

To rotate access, set `NOTES_PASSWORD` and optionally `NOTES_SESSION_SECRET` in
Vercel. Without a separate signing key, the existing server-only bill password
signs sessions. Changing the signing secret invalidates existing sessions.
