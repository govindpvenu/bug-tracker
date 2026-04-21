export type Bug = {
  id: string;
  title: string;
  closed: boolean;
  createdAt: string;
};

export const BUG_STORAGE_KEY = "bug-tracker.bugs";
export const LEGACY_TODO_STORAGE_KEY = "todo-app.todos";

export function isBug(value: unknown): value is Bug {
  if (!value || typeof value !== "object") {
    return false;
  }

  const bug = value as Record<string, unknown>;

  return (
    typeof bug.id === "string" &&
    typeof bug.title === "string" &&
    typeof bug.closed === "boolean" &&
    typeof bug.createdAt === "string"
  );
}

