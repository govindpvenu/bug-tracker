import { bugStorage } from "@/lib/bug-storage";
import { type Bug } from "@/lib/bugs";
import { useSyncExternalStore } from "react";

function createBug(title: string): Bug {
  return {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    title,
    closed: false,
    createdAt: new Date().toISOString(),
  };
}

export function useBugs() {
  const bugs = useSyncExternalStore(
    bugStorage.subscribe,
    bugStorage.getBugs,
    bugStorage.getBugs
  );

  const setBugs = (updater: Bug[] | ((currentBugs: Bug[]) => Bug[])) => {
    const currentBugs = bugStorage.getBugs();
    const nextBugs = typeof updater === "function" ? updater(currentBugs) : updater;

    bugStorage.setBugs(nextBugs);
  };

  const addBug = (title: string) => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return false;
    }

    setBugs((currentBugs) => [createBug(trimmedTitle), ...currentBugs]);
    return true;
  };

  const toggleBug = (id: string) => {
    setBugs((currentBugs) =>
      currentBugs.map((bug) =>
        bug.id === id ? { ...bug, closed: !bug.closed } : bug
      )
    );
  };

  const deleteBug = (id: string) => {
    setBugs((currentBugs) => currentBugs.filter((bug) => bug.id !== id));
  };

  return {
    bugs,
    addBug,
    toggleBug,
    deleteBug,
  };
}

