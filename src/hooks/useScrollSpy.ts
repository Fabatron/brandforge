import { useState, useEffect } from "react";

export function useScrollSpy(ids: string[], offset = 120): string {
  const [activeId, setActiveId] = useState(ids[0] || "");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const obs = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) setActiveId(id);
        },
        { rootMargin: `-${offset}px 0px -60% 0px` }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [ids, offset]);

  return activeId;
}
