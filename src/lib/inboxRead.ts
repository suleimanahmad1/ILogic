const STORAGE_KEY = "inference-logic-inbox-read-ids";
const CHANGE_EVENT = "inbox-read-change";

const readIds = (): Set<string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    const parsed = JSON.parse(raw) as unknown;
    return new Set(Array.isArray(parsed) ? parsed.filter((id) => typeof id === "string") : []);
  } catch {
    return new Set();
  }
};

const saveIds = (ids: Set<string>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
};

export const isMessageRead = (id: string): boolean => readIds().has(id);

export const markMessageAsRead = (id: string): void => {
  const ids = readIds();
  if (ids.has(id)) return;
  ids.add(id);
  saveIds(ids);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
};

export const removeMessageFromRead = (id: string): void => {
  const ids = readIds();
  if (!ids.delete(id)) return;
  saveIds(ids);
  window.dispatchEvent(new CustomEvent(CHANGE_EVENT));
};

export const getUnreadCount = (messages: { id: string }[]): number => {
  const ids = readIds();
  return messages.filter((m) => !ids.has(m.id)).length;
};

export const subscribeInboxRead = (onChange: () => void): (() => void) => {
  const handler = () => onChange();
  window.addEventListener(CHANGE_EVENT, handler);
  return () => window.removeEventListener(CHANGE_EVENT, handler);
};
