export function formatLines(text, start, end, prefix) {
  const from = start === 0 ? 0 : text.lastIndexOf("\n", start - 1) + 1;
  const nextBreak = text.indexOf("\n", end);
  const to = nextBreak === -1 ? text.length : nextBreak;
  const lines = text.slice(from, to).split("\n");
  const remove = prefix && lines.every((line) => line.startsWith(prefix));
  const formatted = lines
    .map((line) => {
      const plain = line.replace(/^(?:#{1,3}\s+|[-*]\s+)/, "");
      return remove || !prefix ? plain : prefix + plain;
    })
    .join("\n");
  return {
    text: text.slice(0, from) + formatted + text.slice(to),
    start: from,
    end: from + formatted.length,
  };
}

export function parseBody(body) {
  const blocks = [];
  for (const line of body.split("\n")) {
    const heading = /^(#{1,3})\s+(.+)$/.exec(line);
    const bullet = /^[-*]\s+(.*)$/.exec(line);
    if (heading)
      blocks.push({
        type: heading[1].length === 1 ? "heading" : "subheading",
        text: heading[2],
      });
    else if (bullet) {
      const previous = blocks.at(-1);
      if (previous?.type === "list") previous.items.push(bullet[1]);
      else blocks.push({ type: "list", items: [bullet[1]] });
    } else
      blocks.push({ type: line.trim() ? "paragraph" : "space", text: line });
  }
  return blocks;
}
