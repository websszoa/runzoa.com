<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project UI rules

- Reuse the project's shadcn UI components whenever an applicable component exists.
- Use Tailwind CSS v4 canonical utility syntax. Prefer theme-backed utilities and modern shorthand over arbitrary or deprecated forms when an equivalent exists, and resolve editor canonical-class warnings before finishing UI work.
- Do not add box-shadow or drop-shadow effects to UI components or page sections.
