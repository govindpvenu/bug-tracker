export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export const TODO_STORAGE_KEY = "todo-app.todos";

export function isTodo(value: unknown): value is Todo {
  if (!value || typeof value !== "object") {
    return false;
  }

  const todo = value as Record<string, unknown>;

  return (
    typeof todo.id === "string" &&
    typeof todo.title === "string" &&
    typeof todo.completed === "boolean" &&
    typeof todo.createdAt === "string"
  );
}
