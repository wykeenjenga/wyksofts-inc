"use client";

import { useRef, useState, type PointerEvent } from "react";

const outcomes = [
  { phrase: "move businesses", label: "Grow", detail: "Digital foundations designed to unlock the next stage of growth." },
  { phrase: "delight customers", label: "Delight", detail: "Fast, thoughtful experiences people enjoy coming back to." },
  { phrase: "simplify work", label: "Simplify", detail: "Purpose-built tools that make complex operations feel effortless." },
];

export function HomeHero() {
  const heroRef = useRef<HTMLElement>(null);
  const [outcomeIndex, setOutcomeIndex] = useState(0);

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (event.pointerType !== "mouse" || !heroRef.current) return;
    const bounds = heroRef.current.getBoundingClientRect();
    const x = event.clientX - bounds.left;
    const y = event.clientY - bounds.top;
    heroRef.current.style.setProperty("--pointer-x", `${x}px`);
    heroRef.current.style.setProperty("--pointer-y", `${y}px`);
    heroRef.current.style.setProperty("--tilt-x", `${((y / bounds.height) - 0.5) * -4}deg`);
    heroRef.current.style.setProperty("--tilt-y", `${((x / bounds.width) - 0.5) * 4}deg`);
    heroRef.current.style.setProperty("--shift-x", `${((x / bounds.width) - 0.5) * 8}px`);
    heroRef.current.style.setProperty("--shift-y", `${((y / bounds.height) - 0.5) * 8}px`);
  }

  function resetPointer() {
    heroRef.current?.style.setProperty("--tilt-x", "0deg");
    heroRef.current?.style.setProperty("--tilt-y", "0deg");
    heroRef.current?.style.setProperty("--shift-x", "0px");
    heroRef.current?.style.setProperty("--shift-y", "0px");
  }

  return (
    <section className="hero home-hero" ref={heroRef} onPointerMove={handlePointerMove} onPointerLeave={resetPointer}>
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-cursor" aria-hidden="true" />
      <div className="hero-main">
        <p className="eyebrow"><span />Software development &amp; digital solutions</p>
        <h1>
          We build digital products that{" "}
          <button className="hero-outcome" type="button" onClick={() => setOutcomeIndex((current) => (current + 1) % outcomes.length)} aria-label={`Change outcome. Currently: ${outcomes[outcomeIndex].phrase}`}>
            <em key={outcomes[outcomeIndex].phrase} aria-live="polite">{outcomes[outcomeIndex].phrase}</em>
          </button>{" "}forward.
        </h1>
        <div className="outcome-explorer">
          <div className="outcome-tabs" role="group" aria-label="Choose an outcome">
            {outcomes.map((outcome, index) => (
              <button className={index === outcomeIndex ? "active" : ""} type="button" key={outcome.phrase} onClick={() => setOutcomeIndex(index)} aria-pressed={index === outcomeIndex}>
                <span>0{index + 1}</span>{outcome.label}
              </button>
            ))}
          </div>
          <p key={outcomes[outcomeIndex].detail} aria-live="polite">{outcomes[outcomeIndex].detail}</p>
        </div>
      </div>
      <aside className="hero-side">
        <div className="availability"><span className="pulse" />Available for new projects</div>
        <p>From first sketch to dependable product, WykSofts brings strategy, design, and engineering together.</p>
        <div className="hero-actions hero-actions-interactive">
          <a className="button button-primary" href="/inquiry/">Start a project <span aria-hidden="true">↗</span></a>
          <a className="text-link" href="/book/">Book a discovery call <span aria-hidden="true">↗</span></a>
        </div>
        <div className="location"><span>Mirage Towers, Nairobi</span><span>Working worldwide</span></div>
      </aside>
    </section>
  );
}
