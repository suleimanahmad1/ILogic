export const sortByPinned = <T extends { is_pinned?: boolean | null; created_at?: string | null; sort_order?: number | null }>(
  items: T[]
): T[] =>
  [...items].sort((a, b) => {
    const pinDiff = (b.is_pinned ? 1 : 0) - (a.is_pinned ? 1 : 0);
    if (pinDiff !== 0) return pinDiff;
    if (a.is_pinned && b.is_pinned) {
      const aOrder = typeof a.sort_order === "number" ? a.sort_order : Number.MAX_SAFE_INTEGER;
      const bOrder = typeof b.sort_order === "number" ? b.sort_order : Number.MAX_SAFE_INTEGER;
      const orderDiff = aOrder - bOrder;
      if (orderDiff !== 0) return orderDiff;
    }
    const at = a.created_at ? new Date(a.created_at).getTime() : 0;
    const bt = b.created_at ? new Date(b.created_at).getTime() : 0;
    return at - bt;
  });
