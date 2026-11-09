import { useEffect, useRef } from "react";

export function ReadingProgress() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const range = document.documentElement.scrollHeight - innerHeight;
        if (ref.current)
          ref.current.style.transform = `scaleX(${range > 0 ? scrollY / range : 0})`;
      });
    };
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    update();
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, []);
  return <div className="reading-progress" ref={ref} aria-hidden="true" />;
}
