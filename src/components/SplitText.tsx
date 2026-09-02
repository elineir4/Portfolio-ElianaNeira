import { useEffect, useRef } from "react";
import type React from "react";
import gsap from "gsap";

import type { ElementType } from "react";

interface Props {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: ElementType;
}

export default function SplitText({
  text,
  className = "",
  delay = 0,
  stagger = 0.04,
  as: Tag = "span",
}: Props) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll(".char");
    gsap.fromTo(
      chars,
      { yPercent: 115, opacity: 0 },
      {
        yPercent: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power4.out",
        stagger,
        delay,
      }
    );
  }, [delay, stagger]);

  const words = text.split(" ");

  const El = Tag as "span";
  return (
    <El ref={ref as React.Ref<HTMLSpanElement>} className={`inline ${className}`} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block overflow-hidden align-bottom">
          {word.split("").map((char, ci) => (
            <span key={ci} className="char inline-block">
              {char}
            </span>
          ))}
          {wi < words.length - 1 && (
            <span className="char inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </El>
  );
}
