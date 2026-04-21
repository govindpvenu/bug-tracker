import {
  BUG_STORAGE_KEY,
  LEGACY_TODO_STORAGE_KEY,
  type Bug,
  isBug,
} from "@/lib/bugs";

type Listener = () => void;
type StorageLike = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
};

const listeners = new Set<Listener>();
let cachedRawValue: string | null = null;
let cachedBugs: Bug[] = [];
let storage: StorageLike | null = null;

function createMemoryStorage(): StorageLike {
  const values = new Map<string, string>();

  return {
    getItem(key) {
      return values.get(key) ?? null;
    },
    setItem(key, value) {
      values.set(key, value);
    },
  };
}

function getStorage(): StorageLike {
  if (storage) {
    return storage;
  }

  if (typeof window !== "undefined" && window.localStorage) {
    storage = window.localStorage;
    return storage;
  }

  storage = createMemoryStorage();
  return storage;
}

function sortBugs(bugs: Bug[]) {
  return [...bugs].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

function parseBugs(rawValue: string | null): Bug[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return sortBugs(parsedValue.filter(isBug));
  } catch {
    return [];
  }
}

function parseLegacyTodos(rawValue: string | null): Bug[] {
  if (!rawValue) {
    return [];
  }

  try {
    const parsedValue = JSON.parse(rawValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    const migratedBugs = parsedValue.flatMap((item) => {
      if (!item || typeof item !== "object") {
        return [];
      }

      const legacyTodo = item as Record<string, unknown>;

      if (
        typeof legacyTodo.id !== "string" ||
        typeof legacyTodo.title !== "string" ||
        typeof legacyTodo.completed !== "boolean" ||
        typeof legacyTodo.createdAt !== "string"
      ) {
        return [];
      }

      return [
        {
          id: legacyTodo.id,
          title: legacyTodo.title,
          closed: legacyTodo.completed,
          createdAt: legacyTodo.createdAt,
        },
      ];
    });

    return sortBugs(migratedBugs);
  } catch {
    return [];
  }
}

function writeBugs(bugs: Bug[]) {
  const normalizedBugs = sortBugs(bugs);
  const nextRawValue = JSON.stringify(normalizedBugs);
  const activeStorage = getStorage();

  cachedRawValue = nextRawValue;
  cachedBugs = normalizedBugs;
  activeStorage.setItem(BUG_STORAGE_KEY, nextRawValue);
  listeners.forEach((listener) => listener());
}

function migrateLegacyTodos() {
  const activeStorage = getStorage();
  const legacyRawValue = activeStorage.getItem(LEGACY_TODO_STORAGE_KEY);
  const migratedBugs = parseLegacyTodos(legacyRawValue);

  if (migratedBugs.length === 0) {
    return [];
  }

  writeBugs(migratedBugs);
  return migratedBugs;
}

function readBugs(): Bug[] {
  const activeStorage = getStorage();
  const rawValue = activeStorage.getItem(BUG_STORAGE_KEY);

  if (rawValue === cachedRawValue) {
    return cachedBugs;
  }

  cachedRawValue = rawValue;
  cachedBugs = parseBugs(rawValue);

  if (cachedBugs.length > 0 || rawValue !== null) {
    return cachedBugs;
  }

  return migrateLegacyTodos();
}

export const bugStorage = {
  getBugs: readBugs,
  setBugs: writeBugs,
  subscribe(listener: Listener) {
    listeners.add(listener);

    return () => {
      listeners.delete(listener);
    };
  },
};

