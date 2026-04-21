import { todoStorage } from "@/lib/todo-storage";
import { type Todo } from "@/lib/todos";
import { useSyncExternalStore } from "react";

function createTodo(title: string): Todo {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
}

export function useTodos() {
  const todos = useSyncExternalStore(
    todoStorage.subscribe,
    todoStorage.getTodos,
    todoStorage.getTodos
  );

  const setTodos = (updater: Todo[] | ((currentTodos: Todo[]) => Todo[])) => {
    const currentTodos = todoStorage.getTodos();
    const nextTodos =
      typeof updater === "function" ? updater(currentTodos) : updater;

    todoStorage.setTodos(nextTodos);
  };

  const addTodo = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return false;
    }

    setTodos((currentTodos) => [createTodo(trimmedTitle), ...currentTodos]);
    return true;
  };

  const toggleTodo = (id: string) => {
    setTodos((currentTodos) =>
      currentTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
  };

  return {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
  };
}
