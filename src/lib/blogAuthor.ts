/** Normalize author from API row (handles schema cache / optional column). */
export const parseBlogAuthorName = (row: { author_name?: string | null } & Record<string, unknown>): string | null => {
  const raw = row.author_name ?? row["author_name"];
  if (typeof raw !== "string") return null;
  const trimmed = raw.trim();
  return trimmed.length > 0 ? trimmed : null;
};

export const blogPostSelect =
  "id, title, slug, excerpt, content, cover_url, author_name, is_pinned, sort_order, tags, published, created_at, updated_at" as const;
