# AGENTS.md

## Scope

This repository is the development starter theme for Ghost. Keep changes focused on theme source, generated assets, CI, and repo-level metadata for this repository.

## Commands

Use pnpm for this repo, pinned by package.json.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm test:ci
pnpm zip
```

Run the test command before opening a PR when theme files, generated assets, dependencies, or CI change.

## CSS guidelines

All CSS follows [design-bytes-css-architecture.md](design-bytes-css-architecture.md). Read it before writing or changing styles. Key rules:

- Every rule lives in a named cascade layer: `reset, tokens, base, layout, components, ghost, utilities`. The order is declared once at the top of the entry file.
- Components reference semantic tokens only, never raw values or primitives. Variants and states change component tokens, not properties.
- Components respond to their container (container queries), not the viewport.
- Ghost admin settings (`--ghost-accent-color`, `--gh-font-heading`, `--gh-font-body`) flow through tokens with theme fallbacks.
- Plain modern CSS with native nesting. No frameworks or preprocessors. PostCSS only bundles and minifies.

The source entry is `assets/css/index.css`, which builds to `assets/built/index.css`. Where the guidelines say "`screen.css`", they mean the source entry file.

Build gotchas:

- Don't add `postcss-preset-env` or any other transpiling plugin. It would polyfill `@layer`, nesting and `light-dark()` and rewrite selectors.
- Keep cssnano's `mergeRules` off in `rollup.config.js`. It flattens nested rules into plain declarations when it merges same-selector rules.
- Don't put a permanent `transition: color` on links inside a query container. Chrome animates them from the UA link blue on page load. Scope transitions to `:hover` / `:focus-visible`.

## Boundaries

- Edit source CSS, JavaScript, Handlebars templates, partials, and package metadata intentionally.
- Keep generated assets/built/ files in sync when source assets change and the repo tracks those outputs.
- Do not commit node_modules/, local Ghost content, generated zip files outside tracked release expectations, or secrets.
- Repo settings, descriptions, and branch rules belong on the GitHub repository; internal clean-repos metadata stays in TryGhost/cleanrepos.
