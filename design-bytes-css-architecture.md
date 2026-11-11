# Design Bytes — Ghost Theme CSS Architecture

A token-driven, layer-based CSS architecture for the Design Bytes Ghost theme, built on a fork of [TryGhost/Starter](https://github.com/TryGhost/Starter).

Plain modern CSS. No frameworks. PostCSS handles only bundling (`@import`) and minification.

---

## Principles

1. **Declare the cascade, don't fight it.** Every rule lives in a named layer. Priority comes from layer order, not selector weight.
2. **Tokens carry intent.** Components reference semantic tokens, never raw values.
3. **Design for the slot, not the screen.** Components respond to their container, not the viewport.
4. **Respect the platform.** Ghost's admin settings (accent color, fonts) flow through the token system instead of being overridden.

---

## Cascade layers

The order is declared once, at the top of `screen.css`:

```css
@layer reset, tokens, base, layout, components, ghost, utilities;
```

Later layers always beat earlier ones, regardless of specificity.

| Layer | Purpose | Contains |
|---|---|---|
| `reset` | Neutralize browser defaults | Box-sizing, margin reset, media defaults |
| `tokens` | Single source of design decisions | Primitive and semantic custom properties |
| `base` | Element defaults | Styles for bare HTML: `body`, headings, links, `:focus-visible` |
| `layout` | Page composition | `.gh-canvas`, `.wrapper`, `.flow`, `.feed` |
| `components` | Reusable UI | `.post-card`, `.tag`, `.button` |
| `ghost` | Platform-specific styles | Koenig editor cards (`.kg-*`), `.gh-content` |
| `utilities` | Single-purpose overrides | `.visually-hidden`, `.flow-tight`, `.text-muted` |

**Why `ghost` gets its own layer:** Koenig card markup is controlled by Ghost, not by us. Isolating it keeps platform concerns out of the component layer and makes Ghost upgrades easier to absorb.

---

## Token tiers

Tokens follow three tiers that map one-to-one to Figma variable collections.

| Tier | Answers | Example | Figma equivalent |
|---|---|---|---|
| **Primitive** | "What values exist?" | `--gray-900`, `--space-4`, `--step-2` | *Primitives* collection |
| **Semantic** | "What is this for?" | `--color-text`, `--color-surface`, `--measure` | *Theme* collection (Light / Dark modes) |
| **Component** | "How does this component vary?" | `--card-gap`, `--button-bg` | Component properties |

**Rule:** components reference semantic tokens only. Primitives exist to feed the semantic tier.

### Primitives

- **Color:** an OKLCH neutral ramp (`--gray-0` → `--gray-950`) and brand values derived from a single `--brand-hue`. OKLCH keeps steps perceptually even, so contrast is predictable across the ramp.
- **Space:** a 4px-based scale named by step (`--space-1` … `--space-24`), not by pixel value.
- **Type:** a fluid scale (`--step--1` … `--step-5`) using `clamp()`. It grows smoothly from 360px to 1280px viewports without breakpoints.
- **Shape and motion:** radii (`--radius-sm` … `--radius-full`), durations, and easing.

> **To do:** `--brand-hue: 265` is a placeholder. Replace it with Design Bytes' brand hue and the brand ramp updates automatically.

### Semantic tokens

| Token | Purpose |
|---|---|
| `--color-bg` / `--color-surface` | Page background / raised surfaces |
| `--color-border` | Dividers and outlines |
| `--color-text` / `--color-text-muted` | Primary / secondary text |
| `--color-accent` | Links, buttons, focus. Reads Ghost's accent color first |
| `--font-body` / `--font-heading` | Reads Ghost's font picker first |
| `--measure` | Readable line length (`68ch`) |
| `--content-wide` | Max width for wide content |
| `--gutter` | Fluid page edge padding |
| `--flow-space` | Default vertical rhythm between siblings |

### Light and dark mode

Color tokens use `light-dark()`, which resolves based on `color-scheme`:

```css
--color-bg: light-dark(var(--gray-0), var(--gray-950));
```

The theme follows the OS setting by default. A manual toggle only needs to set `data-theme="light"` or `data-theme="dark"` on `<html>`.

### Component tokens

Each component declares its own tokens at the top of its block:

```css
.button {
  --button-bg: var(--color-accent);
  --button-text: var(--color-accent-text);
  /* … */
}
```

Variants and states change the token, not the property:

```css
&.is-secondary { --button-bg: transparent; }
```

This keeps every variant's differences visible in one place.

---

## Ghost integration

### Admin settings flow through tokens

| Ghost setting | Custom property Ghost injects | Theme token |
|---|---|---|
| Accent color | `--ghost-accent-color` | `--color-accent` |
| Heading font | `--gh-font-heading` | `--font-heading` |
| Body font | `--gh-font-body` | `--font-body` |

Each token falls back to the theme's own value:

```css
--color-accent: var(--ghost-accent-color, var(--brand-500));
```

The theme works standalone, and an editor's choice in Ghost admin still wins.

### Content grid and Koenig card widths

`.gh-canvas` defines a grid with named lines for three widths:

```
full-start | wide-start | main-start  [content]  main-end | wide-end | full-end
```

- Children default to `main` (readable measure).
- `.kg-width-wide` spans `wide`.
- `.kg-width-full` spans `full`.

Wide and full-bleed cards break out of the text column with no negative margins or width hacks. **gscan flags themes that don't style `.kg-width-wide` and `.kg-width-full`**, so this layer also keeps the theme valid.

---

## Layout primitives

| Class | Behavior |
|---|---|
| `.gh-canvas` | Three-width content grid for posts and pages |
| `.wrapper` | Centered container at `--content-wide` |
| `.flow` | Adds `--flow-space` between siblings. Adjust per instance with `.flow-tight` / `.flow-loose` |
| `.feed` | Auto-fill grid for post lists. Columns adapt with no breakpoints |

---

## Components

### Post card

- `container-type: inline-size` makes the card respond to its **slot**, not the viewport. The same markup works in the feed, a featured row, or a sidebar.
- Above `40rem` of container width, it switches to a side-by-side image and text layout with a larger title.
- The whole card is clickable via a stretched `::after` on `.post-card-link`. This avoids wrapping block content in `<a>` and keeps the accessible name clean.
- The excerpt is clamped to three lines.

### Tag

A pill for tag links, with `--tag-bg` and `--tag-text` overridable in context.

### Button

The primary button uses the accent color. Hover darkens it with `color-mix()` in OKLCH. `.is-secondary` swaps to an outlined style by changing tokens only.

---

## Modern CSS features used

| Feature | Used for |
|---|---|
| `@layer` | Cascade order |
| Native nesting | Component scoping without a preprocessor |
| Custom properties | All tokens |
| `oklch()` / `color-mix()` | Perceptually even color and derived states |
| `light-dark()` + `color-scheme` | Light and dark mode |
| `clamp()` | Fluid type and spacing |
| Container queries | Slot-aware components |
| `:has()` | Parent-aware styling (clickable card) |
| `text-wrap: balance` / `pretty` | Editorial headline and paragraph polish |
| Logical properties | `inline-size`, `margin-block`, `border-inline-start` |
| `interpolate-size` | Animating to `auto` (guarded by reduced-motion) |

---

## Extending the system

**Adding a component**

1. Create its block in the `components` layer (or a partial imported into it).
2. Declare component tokens at the top, sourced from semantic tokens.
3. Express variants and states as token changes.
4. Use a container query if the component appears in slots of different widths.

**Splitting into partials**

When `screen.css` grows, move each layer into its own files and import them into the right layer:

```css
@layer reset, tokens, base, layout, components, ghost, utilities;

@import "tokens/primitives.css" layer(tokens);
@import "tokens/semantic.css" layer(tokens);
@import "components/post-card.css" layer(components);
```

Keep the `@layer` order statement at the top of the entry file so the order never depends on import sequence.

**Keeping Figma and code in sync**

- Primitive and semantic token names should match Figma variable names (`gray/900` ↔ `--gray-900`).
- Light and Dark modes in the Figma *Theme* collection correspond to the two arguments of `light-dark()`.
- Component properties in Figma map to component tokens in CSS.
