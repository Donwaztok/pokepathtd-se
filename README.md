# Poké Path Save Editor

Web editor for **Poké Path TD** save files. Decode a Base64 save string, edit player data, team, box, area, shop and more, then encode back to Base64.

**Designed for game version 1.4.1.** If you run into issues with other versions, [open an issue on GitHub](https://github.com/Donwaztok/pokepathtd-se).

---

## Features

- **Decode / Encode**: Paste or load a `.txt` with a Base64 save string; edit and encode back for use in the game.
- **Player**: Name, portrait, gold, team slots, stars, ribbons, extra gold, routes (records), achievements, achievement progress, stats.
- **Team**: Add, edit and remove Pokémon (species, level, target mode, shiny, favorite, mega, item).
- **Box**: Grid of Pokémon with level; add, edit, remove; “All Lv.100” shortcut.
- **Area**: Current route and waves per route.
- **Shop**: In-game style UI — egg price, egg pool (species list), item stock (sprites + prices), item list (catalog). Edit prices in place.
- **JSON tab**: Full save as JSON for advanced edits (e.g. `new`, `player`, `team`, `box`, `area`, `shop`, `teamManager`).

Sprites and assets are loaded from the game’s CDN ([pokepath-game.pages.dev](https://pokepath-game.pages.dev)); this repo does not ship game assets.

---

## Tech stack

- [Next.js 15](https://nextjs.org/) (App Router)
- [HeroUI v2](https://heroui.com/)
- [React](https://react.dev/) 18
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## Getting started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm or bun

### Install

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build

```bash
npm run build
npm start
```

### Lint

```bash
npm run lint
```

---

## Project structure (main parts)

```
app/
  page.tsx          # Home: input card, decode/encode, tabs (Player, Team, Box, Area, Shop, JSON)
  layout.tsx       # Root layout, navbar, footer
components/
  editor/           # Save editor sections
    PlayerSection.tsx
    TeamSection.tsx
    BoxSection.tsx
    AreaSection.tsx
    ShopSection.tsx
    PokemonCard.tsx
    SpriteImage.tsx
    StatsArrayEditor.tsx
    ...
  navbar.tsx
config/
  site.ts           # App name, description, nav, GitHub/docs links
lib/
  sprites.ts        # Asset base URL, resolveSpriteUrl, pokemonSpriteUrl
types/
  save.ts           # SaveData, Player, Pokemon, ShopData, etc.
```

---

## Contributing

This project is **open source**. You are welcome to:

- **Contribute**: Open pull requests, suggest changes, report bugs or ideas via [GitHub Issues](https://github.com/Donwaztok/pokepathtd-se).
- **Fork**: Use and modify the code for personal or non-commercial use.

Contributions (code, docs, issues) are appreciated. Please open an issue first for larger changes so we can align on the approach.

---

## License

This project is open source under a **non-commercial** license.

- You may **use, copy, modify, and distribute** the project for **non-commercial** purposes.
- You may **contribute** and **fork** the project.
- **Commercial use is not permitted** — you may not monetize or use this project for commercial gain (e.g. paid products or services built on top of it) without explicit permission.

In short: use and contribute for free; do not make money from the project. For full terms, see the [LICENSE](LICENSE) file. (A license such as [Creative Commons Attribution-NonCommercial 4.0 (CC BY-NC 4.0)](https://creativecommons.org/licenses/by-nc/4.0/) or [PolyForm Noncommercial 1.0.0](https://polyformproject.org/licenses/noncommercial/1.0.0/) matches this intent; the repository may use one of these or a custom non-commercial license.)

---

## Links

- **GitHub (issues / repo):** [github.com/Donwaztok/pokepathtd-se](https://github.com/Donwaztok/pokepathtd-se)
- **Game assets (sprites, etc.):** [pokepath-game.pages.dev](https://pokepath-game.pages.dev)
- **PokePath TD:** [pokepath.gg](https://pokepath.gg/en)
