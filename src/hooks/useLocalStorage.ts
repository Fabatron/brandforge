import { useRef, useEffect, useCallback } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T): {
  load: () => T | null;
  save: (data: T) => void;
  remove: () => void;
} {
  const load = useCallback((): T | null => {
    try {
      const stored = localStorage.getItem(key);
      if (stored) return JSON.parse(stored) as T;
      return null;
    } catch {
      return null;
    }
  }, [key]);

  const save = useCallback(
    (data: T) => {
      localStorage.setItem(key, JSON.stringify(data));
    },
    [key]
  );

  const remove = useCallback(() => {
    localStorage.removeItem(key);
  }, [key]);

  return { load, save, remove };
}

/**
 * Auto-save hook: persists a value to localStorage on an interval.
 */
export function useAutoSave<T>(
  key: string,
  getValue: () => T,
  intervalMs = 30000
): void {
  const valueRef = useRef(getValue);
  valueRef.current = getValue;

  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem(key, JSON.stringify(valueRef.current));
    }, intervalMs);
    return () => clearInterval(timer);
  }, [key, intervalMs]);
}
