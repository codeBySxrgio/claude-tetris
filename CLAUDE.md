# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Running the game

No build step or dependencies — open directly in a browser:

```bash
open index.html                 # macOS
python3 -m http.server 8000     # local server, then visit http://localhost:8000
```

## Architecture

Three files, no framework, no bundler:

- **`index.html`** — DOM structure: a 300×600px `<canvas id="board">` for the playfield, a 120×120px `<canvas id="next-canvas">` for the piece preview, and a `#overlay` div for PAUSE / GAME OVER states.
- **`style.css`** — Dark/retro aesthetic via CSS variables, flexbox layout, `backdrop-filter` on the overlay.
- **`game.js`** — All game logic (~300 lines, `'use strict'`, no classes).

### game.js internals

**State** lives in module-level `let` variables: `board` (2D array `ROWS×COLS`, `0` = empty, `1–7` = piece color index), `current` / `next` (piece objects with `{type, shape, x, y}`), `score`, `lines`, `level`, `paused`, `gameOver`, `dropAccum`, `dropInterval`, `animId`.

**Key functions and their roles:**

| Function | What it does |
|---|---|
| `init()` | Resets all state, starts `requestAnimationFrame` loop |
| `loop(ts)` | RAF callback — accumulates `dt`, drops piece when `dropAccum ≥ dropInterval`, calls `draw()` |
| `collide(shape, ox, oy)` | Bounds + occupied-cell check; used everywhere before any move |
| `tryRotate()` | `rotateCW` + wall kicks `[0, -1, 1, -2, 2]` column offsets |
| `lockPiece()` | `merge()` → `clearLines()` → `spawn()` |
| `clearLines()` | Bottom-up scan; splices full rows and unshifts empty rows; updates level and `dropInterval` |
| `ghostY()` | Projects `current` downward until collision; used for ghost rendering and hard drop |
| `draw()` | Clears canvas, draws grid, board cells, ghost (α=0.2), current piece |

**Speed formula:** `dropInterval = Math.max(100, 1000 − (level − 1) × 90)` ms. Level increments every 10 lines.

**Scoring:** `LINE_SCORES = [0, 100, 300, 500, 800]` × level. Soft drop: +1 pt/row. Hard drop: +2 pts/cell fallen.

### Tuning constants (top of game.js)

If you change `COLS`, `ROWS`, or `BLOCK`, also update `width`/`height` on `<canvas id="board">` in `index.html` to match (`COLS × BLOCK` and `ROWS × BLOCK`).
