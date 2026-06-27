"use client";

import { useState } from "react";

const navigationItems = [
  { href: "/", label: "หน้าแรก" },
  { href: "/events", label: "อีเวนต์" },
  { href: "/plan", label: "วางแผน" },
  { href: "/map", label: "Roadmap" },
  { href: "/watts-up", label: "Watt's Up!" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-clay-deep/10 bg-paper/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <a
          href="/"
          className="font-display text-2xl text-clay transition-colors hover:text-clay-deep"
        >
          Sing Journey
        </a>

        <nav aria-label="หลัก" className="hidden items-center gap-6 md:flex">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-clay-deep/80 transition-colors hover:text-clay"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <button
          type="button"
          aria-label={isMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsMenuOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-full border border-clay-deep/15 text-clay-deep transition hover:border-clay hover:text-clay md:hidden"
        >
          <span className="sr-only">{isMenuOpen ? "ปิดเมนู" : "เปิดเมนู"}</span>
          <span aria-hidden="true" className="flex flex-col gap-1">
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </span>
        </button>
      </div>

      <nav
        id="mobile-navigation"
        data-testid="mobile-navigation"
        aria-label="มือถือ"
        hidden={!isMenuOpen}
        className="border-t border-clay-deep/10 px-4 pb-4 md:hidden"
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-2">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-card px-3 py-2 text-sm font-medium text-clay-deep transition hover:bg-rice hover:text-clay"
            >
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </header>
  );
}
