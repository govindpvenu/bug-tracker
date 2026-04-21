import "expo-sqlite/localStorage/install";

import { TODO_STORAGE_KEY, type Todo, isTodo } from "@/lib/todos";

type Listener = () => void;

const listeners = new Set<Listener>();
let cachedRawValue: string | null = null;
let cachedTodos: Todo[] = [];

function sortTodos(todos: Todo[]) {
  return [...todos].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function parseTodos(rawValue: string | null): Todo[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return sortTodos(parsedValue.filter(isTodo));
  } catch {
    return [];
  }
}

function readTodos(): Todo[] {
  const rawValue = localStorage.getItem(TODO_STORAGE_KEY);

  if (rawValue === cachedRawValue) {
    return cachedTodos;
  }

  cachedRawValue = rawValue;
  cachedTodos = parseTodos(rawValue);

  return cachedTodos;
}

function writeTodos(todos: Todo[]) {
  const normalizedTodos = sortTodos(todos);
  const nextRawValue = JSON.stringify(normalizedTodos);

  cachedRawValue = nextRawValue;
  cachedTodos = normalizedTodos;
  localStorage.setItem(TODO_STORAGE_KEY, nextRawValue);
  listeners.forEach((listener) => listener());
}

export const todoStorage = {
  getTodos: readTodos,
  setTodos: writeTodos,
  subscribe(listener: Listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};
