"use client";

import * as React from "react";
import { RoughNotation } from "react-rough-notation";

export type HighlighterAction =
  | "highlight"
  | "circle"
  | "box"
  | "bracket"
  | "crossed-off"
  | "strike-through"
  | "underline";

export type HighlighterProps = Omit<React.HTMLAttributes<HTMLSpanElement>, "color" | "children"> & {
  children?: React.ReactNode;
  color?: string;
  action?: HighlighterAction;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
};

export function Highlighter({
  children,
  color = "#ffd1dc",
  action = "highlight",
  strokeWidth = 1.5,
  animationDuration = 500,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
  ...spanProps
}: HighlighterProps) {
  const ref = React.useRef<HTMLSpanElement | null>(null);
  const [show, setShow] = React.useState(!isView);

  React.useEffect(() => {
    if (!isView) {
      setShow(true);
      return;
    }
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setShow(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [isView]);

  return (
    <span ref={ref} {...spanProps}>
      <RoughNotation
        type={action}
        show={show}
        color={color}
        strokeWidth={strokeWidth}
        animationDuration={animationDuration}
        iterations={iterations}
        padding={padding}
        multiline={multiline}
      >
        <span>{children}</span>
      </RoughNotation>
    </span>
  );
}
