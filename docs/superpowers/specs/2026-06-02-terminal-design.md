# Terminal Feature Design — Fun Stuff Page

**Date:** 2026-06-02
**Status:** Approved

---

## Overview

Replace the janky existing terminal on the Fun Stuff page with a polished, fixed-size 90×25 terminal emulator built in pure TypeScript + CSS. On load it auto-runs neofetch with the classic Arch Linux ASCII logo and x256-style color coding. The user can then type commands into an input line pinned at the bottom.

---

## Layout & Sizing

- Terminal container: exactly `90ch` wide × `25lh` tall using monospace character-cell units
- Font: **Source Code Pro** (Google Fonts), scoped only to `.terminal` — no impact on the rest of the site
- Inner structure (flex column):
  - `#output` — scrollable, fills remaining height above input
  - `.input-line` — always pinned to the bottom row, never scrolls away
- The `.funstuff-main` section centers the terminal horizontally on the page
- Background: near-black (`#0d0d0d`), not pure black

---

## Color System

A minimal set of CSS classes mapping x256-style indices to hex values. Only colors actually used are defined — no full 256-color dump.

| Class | Hex | Usage |
|-------|-----|-------|
| `.c-arch` | `#1793d1` | Arch logo, bold labels, prompt |
| `.c-val` | `#8ec8f0` | Info field values |
| `.c-bold` | `#ffffff` | Username/hostname, separator |
| `.c-dim` | `#666666` | Dim/muted text |
| `.c-err` | `#f38ba8` | Error messages |

Colors are applied via `<span class="c-arch">` etc. in the HTML string output of each command function.

---

## Neofetch Output

Runs automatically on page load (no prompt echo). Constructed as an array of 19+ line strings, each containing:
- Left portion: Arch ASCII logo character (padded to fixed width, wrapped in `.c-arch` span)
- Right portion: info field (label in `.c-arch` bold, value in `.c-val`)

**ASCII art:** the classic 19-line Arch logo:
```
                   -`
                  .o+`
                 `ooo/
                `+oooo:
               `+oooooo:
               -+oooooo+:
             `/:-:++oooo+:
            `/++++/+++++++:
           `/++++++++++++++:
          `/+++ooooooooooooo/`
         ./ooosssso++osssssso+`
        .oossssso-````/ossssss+`
       -osssssso.      :ssssssso.
      :osssssss/        osssso+++.
     /ossssssss/        +ssssooo/-
   `/ossssso+/:-        -:/+osssso+-
  `+sso+:-`                 `.-/+oso:
 `++:.                           `-/+/
.`                                 `/
```

**Info fields (placeholder values — user edits these directly in the source):**
```
arch2kx@archlinux          ← bold white
-----------------
OS:     Arch Linux x86_64
Kernel: [kernel version]
Uptime: [uptime]
Shell:  zsh
WM:     Plasma 6
CPU:    [cpu]
GPU:    [gpu]
Memory: [used] / [total] MiB
```

Info starts on line 1, paired with the ASCII art lines. Lines 11–19 of the ASCII art have no paired info field (blank on the right).

---

## Commands

All commands return an HTML string rendered into `#output` via `innerHTML +=`.

| Command | Output |
|---------|--------|
| `neofetch` | Re-renders the full neofetch block |
| `whoami` | `arch (arch2kx)` |
| `projects` | Bulleted list: Aronasay (link), BA Student Quiz (link) |
| `help` | Lists all available commands |
| `clear` | Sets `output.innerHTML = ""` |
| `sudo rm -rf /` | `zsh: permission denied: bro` |
| *(anything else)* | `zsh: command not found: <cmd>` |

Each non-clear command echoes the prompt line (`arch2kx@archlinux ~ % <cmd>`) in `.c-arch` color before its output.

---

## Prompt

```
arch2kx@archlinux ~ %
```

Rendered in `.c-arch` (`#1793d1`). The `%` matches zsh convention. No OMZ-style decorations — keeping it clean.

---

## TypeScript Structure

`terminal.ts` is fully rewritten (not patched). Key parts:

- `COLOR_CLASSES` — small object mapping semantic names to CSS class names
- `neofetchOutput()` — returns HTML string for the full neofetch block
- `commands: Record<string, () => string>` — map of command name → HTML output fn
- `appendOutput(html: string)` — appends to `#output` and scrolls to bottom
- `handleCommand(cmd: string)` — echoes prompt, dispatches to commands map or error
- `input.addEventListener('keydown')` — Enter triggers handleCommand; clears input

---

## CSS Changes

- Add Google Fonts import for Source Code Pro (preload + stylesheet, same pattern as Noto Sans in `index.html`)
- `.terminal` updated: `width: 90ch`, `height: 25lh`, `overflow: hidden`, `display: flex`, `flex-direction: column`, `font-family: 'Source Code Pro', monospace`, `background: #0d0d0d`
- `#output`: `flex: 1`, `overflow-y: auto`, `white-space: pre-wrap` (wraps at 90ch boundary rather than overflowing)
- `.input-line`: `display: flex`, `gap: 0.5ch`, `white-space: pre`
- `input`: inherits font, transparent bg, no border, full width, no outline
- Color classes: `.c-arch`, `.c-val`, `.c-bold`, `.c-dim`, `.c-err`
- `.funstuff-main` updated to center the terminal (flexbox, align-items center)

---

## Out of Scope

- No real ANSI escape code parsing
- No cursor blinking
- No scrollback beyond what CSS overflow provides
- No mobile layout (terminal is inherently desktop-sized)
