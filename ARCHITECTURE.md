# Dragit Architecture

> **Process-Driven Vertical Slice Architecture** for Electron Applications

This document describes the architectural patterns, conventions, and development workflows for the Dragit project. It serves as the single source of truth for how the codebase is structured and why specific decisions were made.

---

## Table of Contents

1. [Philosophy & Core Principles](#1-philosophy--core-principles)
2. [Directory Structure](#2-directory-structure-the-map)
3. [Layer Deep-Dive](#3-layer-deep-dive)
4. [Developer Guide: Adding a New Feature](#4-developer-guide-adding-a-new-feature)
5. [Architectural Decisions (FAQ)](#5-architectural-decisions-faq)
6. [Quick Reference](#6-quick-reference)

---

## 1. Philosophy & Core Principles

Dragit follows a **Process-Driven Vertical Slice Architecture** built on four foundational pillars:

### 🔒 Process Isolation

Electron applications run in two distinct processes with different security contexts:

| Process | Runtime | Access | Role |
|---------|---------|--------|------|
| **Main** | Node.js | Full system access (filesystem, OS APIs) | Backend services, IPC handling |
| **Renderer** | Chromium | Sandboxed, web-only APIs | React UI, user interaction |

**Why it matters:**
- **Security:** The renderer cannot directly access Node.js APIs, preventing XSS attacks from compromising the system.
- **Stability:** A crash in the renderer doesn't bring down the entire application.
- **Clarity:** Each process has a clear, single responsibility.

```
┌─────────────────────────────────────────────────────────────────┐
│                        MAIN PROCESS                             │
│  (Node.js - Full System Access)                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ GitService  │  │  FSService  │  │ AppService  │  ...         │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐              │
│  │ GitHandler  │  │  FSHandler  │  │ AppHandler  │  (IPC)       │
│  └──────┬──────┘  └──────┴──────┘  └──────┬──────┘              │
└─────────┼───────────────────────────────────┼───────────────────┘
          │              ipcMain              │
══════════╪═══════════════════════════════════╪════════════════════
          │           contextBridge           │
┌─────────┼───────────────────────────────────┼───────────────────┐
│         ▼           PRELOAD SCRIPT          ▼                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │                    window.api                            │    │
│  │  { openFolderDialog(), getCommits(), ... }              │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
          │                                   │
┌─────────┼───────────────────────────────────┼───────────────────┐
│         ▼         RENDERER PROCESS          ▼                   │
│  (Chromium - Sandboxed)                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │useFolderOpen│  │ useGitLogs  │  │  useXxx...  │  (Hooks)     │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
│  ┌──────┴──────┐  ┌──────┴──────┐  ┌──────┴──────┐              │
│  │WelcomeScreen│  │ GitLogList  │  │  XxxView    │  (UI)        │
│  └─────────────┘  └─────────────┘  └─────────────┘              │
└─────────────────────────────────────────────────────────────────┘
```

---

### 📦 Vertical Slices (Feature-Based Organization)

Code is organized by **domain features**, not technical layers.

**❌ Traditional Layered Architecture (Avoid):**
```
src/
├── controllers/     # All handlers mixed together
├── services/        # All business logic mixed
├── models/          # All types mixed
└── views/           # All UI mixed
```

**✅ Vertical Slice Architecture (Our Approach):**
```
src/
├── features/
│   ├── git/         # Everything for Git feature
│   ├── filesystem/  # Everything for FS feature
│   └── settings/    # Everything for Settings feature
```

**Benefits:**
- **Cohesion:** Related code lives together—find everything about a feature in one place.
- **Isolation:** Features can be developed, tested, and modified independently.
- **Scalability:** Adding a new feature doesn't touch existing code paths.
- **Deletability:** Removing a feature is as simple as deleting its folder.

---

### 🔗 Type-Safe IPC

All inter-process communication is strictly typed using shared contracts.

**The Problem:** Traditional Electron apps use magic strings for channels:
```typescript
// ❌ Fragile - typos cause silent failures
ipcMain.handle('git:getCommits', ...)
ipcRenderer.invoke('git:getCommits', ...)  // What if typo?
```

**Our Solution:** Contracts define both the channel and its signature:
```typescript
// ✅ Compile-time safety
// shared/features/git/git.contract.ts
export const GitChannels = {
  GET_COMMITS: 'git:getCommits',
} as const;

export interface IGitApi {
  getCommits(request: GetCommitsRequest): Promise<GetCommitsResult>;
}
```

Now TypeScript ensures:
- Channel names are consistent across main, preload, and renderer.
- Request/response types are enforced at compile time.
- Refactoring is safe—rename once, update everywhere.

---

### ⚙️ Explicit Wiring (Manual Dependency Injection)

Features are manually registered in `startup.ts`—no auto-scanning magic.

```typescript
// main/startup.ts
export function registerFeatures(): RegisteredFeatures {
  const filesystem = createFileSystemFeature();
  const git = createGitFeature();

  filesystem.handler.register();
  git.handler.register();

  return { filesystem, git };
}
```

**Why Manual Registration:**
- **Predictability:** You know exactly what's running and in what order.
- **Testability:** Easy to mock or replace individual features.
- **Hot Reload Safety:** The `unregister()` pattern prevents duplicate handlers.
- **Debugging:** Stack traces point to explicit registration, not framework internals.

---

## 2. Directory Structure (The Map)

```
src/
├── shared/                         # 📜 THE CONTRACTS (Single Source of Truth)
│   ├── api.ts                      # Aggregates all feature APIs into IElectronApi
│   ├── channels.ts                 # Re-exports all channel constants
│   └── features/                   # One folder per feature
│       ├── index.ts                # Barrel export for all contracts
│       ├── filesystem/
│       │   └── fs.contract.ts      # IFileSystemApi + FileSystemChannels
│       └── git/
│           └── git.contract.ts     # IGitApi + GitChannels + Types
│
├── main/                           # 🖥️ BACKEND (Node.js Process)
│   ├── index.ts                    # Electron entry point, window creation
│   ├── startup.ts                  # Feature registration & DI wiring
│   └── features/                   # Backend feature implementations
│       ├── index.ts                # Barrel export for feature factories
│       ├── filesystem/
│       │   ├── fs.service.ts       # Business logic (e.g., dialog APIs)
│       │   ├── fs.handler.ts       # IPC handler registration
│       │   └── index.ts            # createFileSystemFeature() factory
│       └── git/
│           ├── git.service.ts      # Business logic (e.g., git operations)
│           ├── git.handler.ts      # IPC handler registration
│           └── index.ts            # createGitFeature() factory
│
├── preload/                        # 🌉 THE BRIDGE (Secure Context)
│   ├── index.ts                    # Exposes window.api via contextBridge
│   └── index.d.ts                  # TypeScript declaration for window.api
│
└── renderer/                       # 🎨 FRONTEND (Chromium/React)
    ├── index.html                  # Vite entry HTML (must be at renderer root)
    └── src/                        # React application source
        ├── env.d.ts                # Global type augmentation for window.api
        ├── main.tsx                # React DOM entry point
        ├── App.tsx                 # Root component with routing/view switching
        ├── assets/                 # Static assets (CSS, images)
        ├── components/             # Shared/reusable UI components
        ├── hooks/                  # Shared custom hooks
        └── features/               # Frontend feature slices
            ├── index.ts            # Barrel export
            ├── welcome/
            │   ├── WelcomeScreen.tsx
            │   ├── WelcomeScreen.css
            │   ├── useFolderOpen.ts
            │   └── index.ts
            └── git-history/
                ├── GitLogList.tsx
                ├── GitLogList.css
                ├── useGitLogs.ts
                └── index.ts
```

---

## 3. Layer Deep-Dive

### Shared Layer (`src/shared/`)

The **single source of truth** for types, interfaces, and channel constants.

| File | Purpose |
|------|---------|
| `api.ts` | Aggregates all feature APIs into one `IElectronApi` interface |
| `channels.ts` | Re-exports channel constants from all features |
| `features/{name}/{name}.contract.ts` | Defines channels, request/response types, and API interface for one feature |

**Key Rule:** The renderer and main process **never** import from each other—they both import from `shared/`.

```typescript
// shared/api.ts
import type { IFileSystemApi } from './features/filesystem/fs.contract';
import type { IGitApi } from './features/git/git.contract';

export interface IElectronApi extends IFileSystemApi, IGitApi {}
```

---

### Main Layer (`src/main/`)

The **Node.js backend** with full system access.

| File | Purpose |
|------|---------|
| `index.ts` | Electron app lifecycle, window creation, calls `registerFeatures()` |
| `startup.ts` | Creates feature instances and registers IPC handlers |
| `features/{name}/{name}.service.ts` | Pure business logic (no IPC knowledge) |
| `features/{name}/{name}.handler.ts` | Translates IPC calls to service methods |
| `features/{name}/index.ts` | Factory function with dependency injection |

**Service/Handler Pattern:**
```typescript
// Service: Pure business logic, easily testable
class GitService {
  async getCommits(request: GetCommitsRequest): Promise<GetCommitsResult> {
    // Implementation using simple-git, etc.
  }
}

// Handler: IPC glue code, thin wrapper
class GitHandler {
  constructor(private readonly gitService: GitService) {}
  
  register(): void {
    ipcMain.handle(GitChannels.GET_COMMITS, (_, req) => 
      this.gitService.getCommits(req)
    );
  }
}
```

---

### Preload Layer (`src/preload/`)

The **secure bridge** between Node.js and the browser.

```typescript
// preload/index.ts
const api: IElectronApi = {
  openFolderDialog: () => ipcRenderer.invoke(FileSystemChannels.OPEN_FOLDER_DIALOG),
  getCommits: (req) => ipcRenderer.invoke(GitChannels.GET_COMMITS, req),
};

contextBridge.exposeInMainWorld('api', api);
```

**Security Rules:**
- Never expose `ipcRenderer` directly.
- Never expose Node.js modules (`fs`, `path`, etc.).
- Only expose specific, typed methods.

---

### Renderer Layer (`src/renderer/src/`)

The **React frontend**, sandboxed in Chromium.

| File | Purpose |
|------|---------|
| `env.d.ts` | Augments `Window` interface with `api: IElectronApi` |
| `App.tsx` | Root component, view switching logic |
| `features/{name}/use{Feature}.ts` | Custom hook calling `window.api` methods |
| `features/{name}/{Component}.tsx` | UI component consuming the hook |

**Hook Pattern:**
```typescript
// features/git-history/useGitLogs.ts
export function useGitLogs(repoPath: string) {
  const [commits, setCommits] = useState<GitCommit[]>([]);
  
  useEffect(() => {
    window.api.getCommits({ repoPath }).then(result => {
      if (result.success) setCommits(result.commits);
    });
  }, [repoPath]);
  
  return { commits };
}
```

---

## 4. Developer Guide: Adding a New Feature

Follow this step-by-step workflow to add a new feature (e.g., `settings`):

### Step 1: Define the Contract

Create the shared contract that both processes will use.

```
📁 src/shared/features/settings/settings.contract.ts
```

```typescript
// 1. Define channel constants
export const SettingsChannels = {
  GET_SETTINGS: 'settings:get',
  UPDATE_SETTINGS: 'settings:update',
} as const;

// 2. Define types
export interface AppSettings {
  theme: 'light' | 'dark';
  autoSave: boolean;
}

export interface UpdateSettingsRequest {
  settings: Partial<AppSettings>;
}

// 3. Define the API interface
export interface ISettingsApi {
  getSettings(): Promise<AppSettings>;
  updateSettings(request: UpdateSettingsRequest): Promise<void>;
}
```

**Update the aggregator:**
```typescript
// src/shared/api.ts
import type { ISettingsApi } from './features/settings/settings.contract';

export interface IElectronApi extends IFileSystemApi, IGitApi, ISettingsApi {}
```

---

### Step 2: Implement the Backend

Create the service (business logic) and handler (IPC glue).

```
📁 src/main/features/settings/settings.service.ts
```

```typescript
import type { AppSettings, UpdateSettingsRequest } from '../../../shared/features/settings/settings.contract';

export class SettingsService {
  private settings: AppSettings = { theme: 'dark', autoSave: true };

  async getSettings(): Promise<AppSettings> {
    return this.settings;
  }

  async updateSettings(request: UpdateSettingsRequest): Promise<void> {
    this.settings = { ...this.settings, ...request.settings };
  }
}
```

```
📁 src/main/features/settings/settings.handler.ts
```

```typescript
import { ipcMain } from 'electron';
import { SettingsChannels } from '../../../shared/features/settings/settings.contract';
import type { SettingsService } from './settings.service';

export class SettingsHandler {
  constructor(private readonly settingsService: SettingsService) {}

  register(): void {
    ipcMain.handle(SettingsChannels.GET_SETTINGS, () => 
      this.settingsService.getSettings()
    );
    ipcMain.handle(SettingsChannels.UPDATE_SETTINGS, (_, req) => 
      this.settingsService.updateSettings(req)
    );
  }

  unregister(): void {
    ipcMain.removeHandler(SettingsChannels.GET_SETTINGS);
    ipcMain.removeHandler(SettingsChannels.UPDATE_SETTINGS);
  }
}
```

```
📁 src/main/features/settings/index.ts
```

```typescript
import { SettingsService } from './settings.service';
import { SettingsHandler } from './settings.handler';

export function createSettingsFeature() {
  const service = new SettingsService();
  const handler = new SettingsHandler(service);
  return { service, handler };
}
```

**Register in startup:**
```typescript
// src/main/startup.ts
import { createSettingsFeature } from './features/settings';

export function registerFeatures() {
  const settings = createSettingsFeature();
  settings.handler.register();
  // ... other features
}
```

---

### Step 3: Expose in Preload

Add the new API methods to the exposed `api` object.

```typescript
// src/preload/index.ts
import { SettingsChannels } from '../shared/features/settings/settings.contract';

const api: IElectronApi = {
  // ... existing methods
  getSettings: () => ipcRenderer.invoke(SettingsChannels.GET_SETTINGS),
  updateSettings: (req) => ipcRenderer.invoke(SettingsChannels.UPDATE_SETTINGS, req),
};
```

---

### Step 4: Implement the Frontend

Create the hook and UI component.

```
📁 src/renderer/src/features/settings/useSettings.ts
```

```typescript
import { useState, useEffect } from 'react';
import type { AppSettings } from '../../../../shared/features/settings/settings.contract';

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings | null>(null);

  useEffect(() => {
    window.api.getSettings().then(setSettings);
  }, []);

  const updateSettings = async (updates: Partial<AppSettings>) => {
    await window.api.updateSettings({ settings: updates });
    setSettings(prev => prev ? { ...prev, ...updates } : null);
  };

  return { settings, updateSettings };
}
```

```
📁 src/renderer/src/features/settings/SettingsPanel.tsx
```

```typescript
import { useSettings } from './useSettings';

export function SettingsPanel() {
  const { settings, updateSettings } = useSettings();

  if (!settings) return <div>Loading...</div>;

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={settings.autoSave}
          onChange={(e) => updateSettings({ autoSave: e.target.checked })}
        />
        Auto-save
      </label>
    </div>
  );
}
```

---

### Checklist Summary

| Step | Files to Create/Modify |
|------|----------------------|
| 1. Contract | `shared/features/{name}/{name}.contract.ts`, update `shared/api.ts` |
| 2. Backend | `main/features/{name}/` (service, handler, index), update `startup.ts` |
| 3. Preload | Update `preload/index.ts` with new methods |
| 4. Frontend | `renderer/src/features/{name}/` (hook, component, index) |

---

## 5. Architectural Decisions (FAQ)

### Why `src/renderer/src/` (nested source)?

The `renderer/` folder contains both **Vite configuration** and **React source code**. Nesting the source in `src/` provides:

1. **Separation of Concerns:** Config files (`vite.config.ts`, `index.html`) stay at the root; source code is isolated.
2. **Standard Vite Structure:** This mirrors the default Vite project layout, making it familiar to developers.
3. **Clean Imports:** Relative paths from components don't navigate through config files.
4. **Monorepo Compatibility:** Each "project" (main, preload, renderer) has its own clear boundary.

```
renderer/
├── index.html          # Vite entry (must be here for electron-vite)
├── vite.config.ts      # Renderer-specific Vite config
└── src/                # All React source code
    ├── App.tsx
    └── features/
```

---

### Why Manual `registerFeatures()` Instead of Auto-Discovery?

Many frameworks use decorators or file-scanning to auto-register modules. We explicitly avoid this:

| Auto-Discovery | Manual Registration |
|----------------|---------------------|
| "Magic" behavior, hard to trace | Explicit, readable, debuggable |
| Side effects on import | No side effects until `register()` called |
| Difficult to mock in tests | Easy to inject mocks |
| Hot reload can duplicate handlers | `unregister()` prevents duplication |

**Hot Reload Safety Example:**

```typescript
// startup.ts
let registeredFeatures: RegisteredFeatures | null = null;

export function registerFeatures(): RegisteredFeatures {
  if (registeredFeatures) {
    console.warn('Features already registered');
    return registeredFeatures;
  }
  // ... registration
}

export function unregisterFeatures(): void {
  if (!registeredFeatures) return;
  registeredFeatures.git.handler.unregister();
  registeredFeatures = null;
}
```

On app quit or during development hot-reload, calling `unregisterFeatures()` ensures old handlers are removed before new ones are added.

---

### Why Separate Service and Handler Classes?

**Single Responsibility Principle:**

- **Service:** Contains pure business logic, has no knowledge of IPC or Electron.
- **Handler:** Thin glue layer that maps IPC channels to service methods.

**Benefits:**
- Services are easily unit-testable without mocking `ipcMain`.
- Handlers can be replaced or extended without touching business logic.
- Same service can be reused for different transport layers (e.g., REST API in future).

---

### Why Contracts in `shared/` and Not Co-located?

Keeping contracts in a neutral `shared/` folder ensures:

1. **No Circular Dependencies:** Main doesn't import from renderer, and vice versa.
2. **Single Source of Truth:** Types are defined once, used everywhere.
3. **Clear Dependency Direction:** Both processes depend on `shared/`, creating a clean dependency graph.

```
        ┌──────────┐
        │  shared  │  (Types & Contracts)
        └────┬─────┘
             │
     ┌───────┴───────┐
     ▼               ▼
┌─────────┐     ┌──────────┐
│  main   │     │ renderer │
└─────────┘     └──────────┘
```

---

## 6. Quick Reference

### Adding a New IPC Channel

1. Add channel constant to `shared/features/{feature}/{feature}.contract.ts`
2. Add method signature to the feature's `I{Feature}Api` interface
3. Implement in `main/features/{feature}/{feature}.service.ts`
4. Register in `main/features/{feature}/{feature}.handler.ts`
5. Expose in `preload/index.ts`
6. Call via `window.api.{method}()` in renderer

### Naming Conventions

| Item | Convention | Example |
|------|------------|---------|
| Feature folder | kebab-case | `git-history/` |
| Contract file | `{feature}.contract.ts` | `git.contract.ts` |
| Service class | PascalCase + Service | `GitService` |
| Handler class | PascalCase + Handler | `GitHandler` |
| Hook | camelCase with `use` prefix | `useGitLogs` |
| Channel | namespace:action | `git:getCommits` |

### Import Paths

```typescript
// From main to shared
import { GitChannels } from '../../../shared/features/git/git.contract';

// From renderer to shared
import type { GitCommit } from '../../../../shared/features/git/git.contract';

// Feature barrel exports (recommended)
import { WelcomeScreen, useFolderOpen } from './features/welcome';
```

---

## See Also

- **[README.md](README.md)** — Project overview, installation, and quick start guide
- **[CONTRIBUTING.md](CONTRIBUTING.md)** — Contribution guidelines, code standards, and pull request process

---

*Last updated: January 2026*

