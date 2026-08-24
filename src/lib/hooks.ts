import { useEffect, useRef, useState } from "react";

export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function useInView<T extends HTMLElement>(threshold = 0.14) {
  const ref = useRef<T>(null);
  const [on, setOn] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) {
      setOn(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold, rootMargin: "0px 0px -7% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduced, threshold]);
  return [ref, on] as const;
}

export function useScrollSpy(ids: string[]): string {
  const [active, setActive] = useState(ids[0] ?? "");
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const marker = window.scrollY + window.innerHeight * 0.34;
        let current = ids[0] ?? "";
        for (const id of ids) {
          const el = document.getElementById(id);
          if (el && el.offsetTop <= marker) current = id;
        }
        const bottom =
          window.scrollY + window.innerHeight >=
          document.documentElement.scrollHeight - 4;
        if (bottom && ids.length) current = ids[ids.length - 1];
        setActive(current);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);
  return active;
}

export function useReadingProgress(): number {
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const max =
          document.documentElement.scrollHeight - window.innerHeight;
        setP(max > 0 ? Math.min(1, window.scrollY / max) : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);
  return p;
}

const SCRAMBLE_CHARS = "◆·—/MELIORA0123456789";

export function useScramble(text: string, speed = 26): string {
  const reduced = useReducedMotion();
  const [out, setOut] = useState(() =>
    text.replace(/[^\s]/g, "·")
  );
  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    let frame = 0;
    let last = 0;
    let raf = 0;
    const tick = (t: number) => {
      if (t - last >= speed) {
        last = t;
        frame += 1;
        const fixed = Math.floor(frame / 2);
        let s = "";
        for (let i = 0; i < text.length; i += 1) {
          const c = text[i];
          if (c === " " || i < fixed) s += c;
          else s += SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)];
        }
        setOut(s);
        if (fixed >= text.length) return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, reduced, speed]);
  return out;
}

export function useLocalStorageState<T>(
  key: string,
  initial: T
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* приватный режим — просто не сохраняем */
    }
  }, [key, value]);
  return [value, setValue];
}
