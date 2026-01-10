# Dragit

> **Stop typing commands. Start dragging history.**

<p align="center">
  <img src="resources/banner.png" alt="Dragit Logo" width="320"">
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="ARCHITECTURE.md">Architecture</a> •
  <a href="CONTRIBUTING.md">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-Apache%202.0-blue.svg" alt="License">
  <img src="https://img.shields.io/badge/electron-39.x-47848F.svg" alt="Electron">
  <img src="https://img.shields.io/badge/react-19.x-61DAFB.svg" alt="React">
  <img src="https://img.shields.io/badge/typescript-5.x-3178C6.svg" alt="TypeScript">
</p>

---

## What is Dragit?

**Dragit** is a strictly typed, highly performant Git client built with Electron and React. It reimagines version control as a **tangible, interactive experience**.

Instead of memorizing CLI commands, you manage your repository through intuitive **Drag & Drop** actions:

- 📁 **Drag files** to stage them
- 🔀 **Drag commits** to rebase or cherry-pick
- 🏷️ **Drag branches** to merge

Git should feel like rearranging blocks, not typing incantations.

---

## Features

### 🎯 Visual Staging

Forget `git add -p`. Simply drag files from the **"Changes"** zone into the **"Staged"** zone. See exactly what's going where before you commit.

### 📊 Interactive History

Visualize your entire commit graph as an interactive timeline. Click, drag, and manipulate history directly—no more cryptic rebase commands.

### 🖱️ Keyboard Optional

Designed for a **fully mouse-driven workflow**. Every action is accessible via intuitive gestures, making Git approachable for visual learners and power users alike.

### 🔒 Rock-Solid Architecture

Built on a **Process-Driven Vertical Slice Architecture** that strictly separates concerns:

- **Security:** Renderer process is fully sandboxed—no direct filesystem access
- **Stability:** Crashes in UI don't bring down the entire app
- **Maintainability:** Features are self-contained vertical slices

[→ Read the Architecture Guide](ARCHITECTURE.md)

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Desktop Runtime** | Electron 39 |
| **Build System** | Vite + electron-vite |
| **Frontend** | React 19 + TypeScript 5 |
| **Architecture** | Process-Driven Vertical Slice |
| **IPC** | Type-safe contracts with compile-time guarantees |

---

## Quick Start

### Prerequisites

- **Node.js** 20.x or later
- **Git** 2.x or later
- **npm** 10.x or later (comes with Node.js)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/dragit.git
cd dragit

# Install dependencies
npm install

# Start development mode
npm run dev
```

The app will launch with hot-reload enabled. Make changes to the code and see them instantly.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development mode with hot-reload |
| `npm run build` | Build for production |
| `npm run build:win` | Build Windows installer |
| `npm run build:mac` | Build macOS installer |
| `npm run build:linux` | Build Linux packages |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run format` | Format code with Prettier |

---

## Understanding the Codebase

Before diving into the code, **read the [Architecture Guide](ARCHITECTURE.md)**. It explains:

- Why we use Process-Driven Vertical Slice Architecture
- How to navigate the `src/` directory
- The type-safe IPC pattern between main and renderer
- Step-by-step guide for adding new features

```
src/
├── shared/      # Type contracts (the "single source of truth")
├── main/        # Node.js backend (services + IPC handlers)
├── preload/     # Secure bridge to renderer
└── renderer/    # React frontend
```

---

## Contributing

We welcome contributions! Whether it's fixing bugs, adding features, or improving docs—every bit helps.

**Before contributing:**

1. 📖 Read the **[Architecture Guide](ARCHITECTURE.md)** to understand the codebase
2. 📝 Read the **[Contributing Guide](CONTRIBUTING.md)** for code standards
3. 🔐 **All commits must be GPG/SSH signed** (unsigned commits will be rejected)

[→ Start Contributing](CONTRIBUTING.md)

---

## License

```
Copyright 2026 Kheif Labs

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

See [LICENSE](LICENSE.txt) for the full text.

---

## Acknowledgments

- Built with [Electron](https://www.electronjs.org/) and [electron-vite](https://electron-vite.org/)
- UI powered by [React](https://react.dev/)
- Inspired by the dream of making Git truly visual

---

<p align="center">
  <strong>Dragit</strong> — Because Git should be seen, not just typed.
</p>
