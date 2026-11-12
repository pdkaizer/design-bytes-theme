# Design Bytes Theme

The custom [Ghost](https://ghost.org) theme for [Design Bytes](https://design-bytes.com), a site about the threads of creativity in digital product design. It's built on a fork of [TryGhost/Starter](https://github.com/TryGhost/Starter).

## Features

- **Light and dark modes.** The theme follows the reader's system setting, and a header toggle lets them choose. Their choice is remembered.
- **Typography:** IBM Plex Serif headings and Inter body copy on a fluid 16px type scale. Ghost's font service provides the upright styles; the theme bundles true italics (`assets/fonts/`, SIL Open Font License).
- **Plain modern CSS:** cascade layers, design tokens, native nesting and container queries, with no framework. See [design-bytes-css-architecture.md](design-bytes-css-architecture.md).
- **Ghost admin settings respected:** the accent colour and fonts set in admin flow through the theme's tokens.
- **Theme settings** for the footer's publisher line and disclaimer.

## Browser support

Modern browsers from roughly the last two years: Safari 17.5+, and Chrome, Edge and Firefox from 2024 on. The CSS ships untranspiled, with no fallbacks. The newest feature it depends on is `light-dark()` for the light and dark colours. Older browsers will show broken colours.

## Accessibility

Colour tokens meet WCAG AA contrast in both modes (body text about 18:1, the weakest text pairing about 7:1). The theme includes a skip link, a keyboard-operable menu button that announces its state, a focus ring from the accent colour, and reduced-motion support.

## Ghost admin setup

These settings live in Ghost admin, not in the theme:

| Where | Setting |
|---|---|
| Settings → Design → Brand → Typography | Heading font **IBM Plex Serif**, body font **Inter** |
| Settings → Design → Brand | Accent colour (Design Bytes uses `#342828`; the theme lightens it automatically in dark mode) |
| Settings → Design → Theme | Publisher name, publisher URL, footer disclaimer |
| Settings → Navigation | Primary menu (header) and secondary menu (footer, links only) |

## Development

Requires Node.js and pnpm (the version is pinned in `package.json`).

```bash
pnpm install --frozen-lockfile
pnpm dev        # build CSS and JS, then rebuild and live-reload on save
pnpm build      # one-off production build into assets/built/
pnpm zip        # build and package the theme as design-bytes-theme.zip
pnpm test:ci    # zip and validate with gscan (fails on fatal issues)
npx gscan .     # full validation report, including errors and warnings
```

### Local Ghost

The theme is symlinked into a local Ghost install, so Ghost always serves the files on disk:

```bash
ln -s ~/design-bytes-theme ~/db-ghost-local/content/themes/design-bytes-theme
```

Activate it under Settings → Design → Change theme. CSS and template edits show on refresh while `pnpm dev` runs. New partials or `package.json` changes need `ghost restart`.

## Project structure

```
assets/css/
  index.css           entry file: layer order and imports
  reset.css           layer: reset
  tokens/             layer: tokens (primitives and semantic tokens)
  base.css            layer: base (bare HTML elements)
  layout.css          layer: layout (content grid, feed, flow)
  components/         layer: components (header, card, buttons, …)
  ghost/              layer: ghost (post content, Koenig cards, Portal)
  utilities.css       layer: utilities (.responsive-image, .visually-hidden, …)
assets/js/            theme toggle, mobile menu, infinite scroll
partials/             site header, site footer, card, theme toggle, icons
*.hbs                 page templates
```

## Sections: Articles and Bytes

`/articles/` and `/bytes/` list every post tagged **Article** or **Byte**, using `articles.hbs` and `bytes.hbs`. They're defined in [routes.yaml](routes.yaml), and [redirects.yaml](redirects.yaml) sends the old `/recent-bytes/` page to `/bytes/`. Neither file is part of the theme zip. Upload both in Ghost admin under **Settings → Labs** (Routes and Redirects). Each section's intro text is its tag's description in Ghost admin.

## Deployment

Merging to `main` runs the **Deploy Theme** workflow. It deploys to Ghost Pro only when the repository secrets `GHOST_ADMIN_API_URL` and `GHOST_ADMIN_API_KEY` are set. Until then the deploy step is skipped. Repository activity is posted to the Design Bytes Custom Theme project in Basecamp.

## License

Released under the [MIT license](LICENSE). Based on Ghost Starter, copyright (c) 2013-2026 Ghost Foundation.
