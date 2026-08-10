<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# React Starter Template Rules

When working on this template, adhere to the following tech stack and architectural conventions:

## 1. Next.js 16 (App Router)
- Always use the **App Router** (`src/app/`). Do NOT create a `pages/` directory.
- Differentiate clearly between Server Components (default) and Client Components (add `"use client";` at the top). Use Client Components only when interactivity or browser APIs are required.
- Do not create custom `_document.tsx` or `_app.tsx`. Use `layout.tsx`.

## 2. Tailwind CSS v4
- We use **Tailwind CSS v4**. Do not create or look for a `tailwind.config.js` or `tailwind.config.ts`.
- All styling configuration, theme variables, and custom CSS should be handled in `src/index.css` using the new `@theme` syntax.
- Do not use `@apply` if it can be solved with utility classes.

## 3. FlyonUI
- **FlyonUI v2** is pre-configured and available.
- Prioritize using FlyonUI component classes (e.g., `btn`, `input`, `modal`, `card`) instead of building custom variants from scratch.
- The plugin is initialized in `src/index.css` via `@plugin "flyonui";`.

## 4. Zustand (State Management)
- Place all global stores in `src/store/`.
- **CRITICAL**: Be very careful with Server-Side Rendering (SSR) hydration mismatches when using Zustand. Do not initialize store values directly with browser APIs (e.g., `localStorage`). Always wrap browser API access in `typeof window !== "undefined"` checks or use a standard hydration mechanism.

## 5. Components Architecture
- Reusable, generic UI components (buttons, inputs) go in `src/components/ui/`.
- Domain-specific or common page components go in `src/components/common/`.
- Modals, layouts, and skeletons have their respective folders in `src/components/`.
