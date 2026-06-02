const removeDangerousBlocks = (input: string) =>
  input
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, "");

export const sanitizeRichText = (input: string | null | undefined): string => {
  if (!input) return "";
  let value = removeDangerousBlocks(input);
  value = value
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");

  if (typeof window === "undefined" || typeof DOMParser === "undefined") {
    return value.replace(/\n/g, "<br/>");
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div>${value}</div>`, "text/html");
  const root = doc.body.firstElementChild as HTMLElement | null;
  if (!root) return "";

  const allowedTags = new Set([
    "P",
    "BR",
    "B",
    "STRONG",
    "I",
    "EM",
    "U",
    "MARK",
    "SPAN",
    "A",
    "UL",
    "OL",
    "LI",
    "BLOCKQUOTE",
    "H1",
    "H2",
    "H3",
    "H4",
    "H5",
    "H6",
    "S",
    "DEL",
  ]);

  const sanitizeNode = (node: Node) => {
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as HTMLElement;
    if (!allowedTags.has(el.tagName)) {
      const parent = el.parentNode;
      while (el.firstChild) parent?.insertBefore(el.firstChild, el);
      parent?.removeChild(el);
      return;
    }

    [...el.attributes].forEach((attr) => {
      const key = attr.name.toLowerCase();
      if (key.startsWith("on")) {
        el.removeAttribute(attr.name);
        return;
      }
      if (el.tagName === "A") {
        if (key !== "href" && key !== "target" && key !== "rel") el.removeAttribute(attr.name);
      } else if (key !== "style") {
        el.removeAttribute(attr.name);
      }
    });

    if (el.tagName === "A") {
      const href = (el.getAttribute("href") || "").trim();
      if (!/^https?:\/\//i.test(href) && !/^mailto:/i.test(href)) {
        el.removeAttribute("href");
      } else {
        el.setAttribute("target", "_blank");
        el.setAttribute("rel", "noopener noreferrer");
      }
    }

    if (el.hasAttribute("style")) {
      const style = el.getAttribute("style") || "";
      const safe = style
        .split(";")
        .map((part) => part.trim())
        .filter(Boolean)
        .filter((part) =>
          /^(font-size|font-family|font-weight|text-decoration|background|background-color|color|text-align)\s*:/i.test(part)
        )
        .join("; ");
      if (safe) el.setAttribute("style", safe);
      else el.removeAttribute("style");
    }

    [...el.childNodes].forEach(sanitizeNode);
  };

  [...root.childNodes].forEach(sanitizeNode);
  return root.innerHTML.replace(/\n/g, "<br/>");
};

export const richTextToPlain = (input: string | null | undefined): string => {
  if (!input) return "";
  return input.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
};

