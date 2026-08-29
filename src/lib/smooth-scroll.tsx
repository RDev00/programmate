"use client";

import { ReactLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactLenis
    root
    options={{
      autoRaf: true,
      anchors: true,
      autoToggle: true,
    }}>
      {children}
    </ReactLenis>
  );
}
