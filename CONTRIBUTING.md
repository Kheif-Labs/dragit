# Contributing to Dragit

> **We want to make Git visual for everyone. Join us in building the most intuitive Git client.**

Thank you for your interest in contributing to Dragit! This document outlines our standards, processes, and expectations. Please read it carefully before submitting any code.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Security & Integrity](#security--integrity)
3. [Before You Start](#before-you-start)
4. [Development Standards](#development-standards)
5. [Pull Request Process](#pull-request-process)
6. [Reporting Issues](#reporting-issues)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive environment. All contributors are expected to:

- Be respectful and constructive in all communications
- Welcome newcomers and help them get started
- Focus on what's best for the community and the project
- Accept constructive criticism gracefully

---

## Security & Integrity

### 🔐 GPG/SSH Signing Required

> **All commits MUST be signed using GPG or SSH. Unsigned commits will be rejected.**

This requirement ensures:
- **Authenticity:** We can verify who wrote the code
- **Integrity:** Commits cannot be tampered with
- **Trust:** Users can trust the provenance of our codebase

**How to set up commit signing:**

1. [Generate a GPG key](https://docs.github.com/en/authentication/managing-commit-signature-verification/generating-a-new-gpg-key)
2. [Add the key to your GitHub account](https://docs.github.com/en/authentication/managing-commit-signature-verification/adding-a-gpg-key-to-your-github-account)
3. [Configure Git to sign commits](https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits)

```bash
# Configure Git to sign all commits
git config --global commit.gpgsign true
git config --global user.signingkey YOUR_KEY_ID
```

**Alternatively, use SSH signing:**

- [About commit signature verification](https://docs.github.com/en/authentication/managing-commit-signature-verification/about-commit-signature-verification)

### 🛡️ Security Vulnerabilities

If you discover a security vulnerability, **do NOT open a public issue**. Instead, email us directly at [feedback@kheiflabs.com] with details. We will respond within 48 hours.

---

## Before You Start

### 1. Read the Architecture Guide

**This is mandatory.** Before writing any code, you must understand our architecture:

📖 **[Read ARCHITECTURE.md](ARCHITECTURE.md)**

Dragit follows a **Process-Driven Vertical Slice Architecture**. Key concepts:

- **Process Isolation:** Main (Node.js) and Renderer (React) are strictly separated
- **Vertical Slices:** Code is organized by features, not technical layers
- **Type-Safe IPC:** All communication uses shared contracts—no magic strings
- **Explicit Wiring:** Manual dependency injection in `startup.ts`

### 2. Set Up Your Development Environment

```bash
# Fork and clone the repository
git clone https://github.com/YOUR_USERNAME/dragit.git
cd dragit

# Install dependencies
npm install

# Start development mode
npm run dev
```

### 3. Understand the Directory Structure

```
src/
├── shared/           # Contracts & Types (Single Source of Truth)
│   └── features/     # One contract per feature
├── main/             # Backend (Node.js)
│   └── features/     # Services + Handlers
├── preload/          # Secure Bridge
└── renderer/src/     # Frontend (React)
    └── features/     # UI Components + Hooks
```

---

## Development Standards

### 🏗️ Architecture Compliance

All code must follow the vertical slice architecture:

| New Code Location | What Belongs There |
|-------------------|-------------------|
| `shared/features/{name}/` | Contracts, types, channel constants |
| `main/features/{name}/` | Service (logic), Handler (IPC), Index (factory) |
| `renderer/src/features/{name}/` | Components, hooks, styles |

**❌ Never:**
- Import from `main/` in `renderer/` (or vice versa)
- Add IPC handlers outside of a Handler class
- Use magic strings for IPC channels
- Bypass the `startup.ts` registration

### 📝 Naming Conventions

These conventions are **strictly enforced**:

| Item | Convention | Example |
|------|------------|---------|
| Feature Folders | `kebab-case` | `git-history/`, `file-staging/` |
| Contract Files | `*.contract.ts` | `git.contract.ts` |
| Service Classes | PascalCase + Service | `GitService`, `FileSystemService` |
| Handler Classes | PascalCase + Handler | `GitHandler`, `FileSystemHandler` |
| React Hooks | camelCase with `use` prefix | `useGitLogs`, `useFolderOpen` |
| IPC Channels | `namespace:action` | `git:getCommits`, `fs:openDialog` |
| Component Files | PascalCase | `GitLogList.tsx`, `WelcomeScreen.tsx` |

### 🔒 Type Safety

> **No `any` types allowed.**

- All IPC communication must go through `shared/` contracts
- Use `unknown` instead of `any` when type is truly unknown, then narrow it
- Enable strict TypeScript settings (already configured)

```typescript
// ❌ Bad
const data: any = await window.api.getCommits();

// ✅ Good
import type { GetCommitsResult } from '@shared/features/git/git.contract';
const data: GetCommitsResult = await window.api.getCommits(request);
```

### 🧪 Testing (Coming Soon)

We are establishing testing patterns. For now:

- Services should be written as pure classes (no Electron dependencies)
- Handlers should be thin wrappers around services
- This separation enables easy unit testing

### 📏 Code Style

We use Prettier and ESLint. Before committing:

```bash
npm run format   # Auto-format code
npm run lint     # Check for issues
npm run typecheck  # Verify types
```

---

## Pull Request Process

### 1. Branch Naming

Use descriptive branch names with prefixes:

| Prefix | Use Case | Example |
|--------|----------|---------|
| `feat/` | New features | `feat/branch-visualization` |
| `fix/` | Bug fixes | `fix/commit-list-scroll` |
| `docs/` | Documentation | `docs/update-readme` |
| `refactor/` | Code refactoring | `refactor/git-service` |
| `chore/` | Maintenance tasks | `chore/update-deps` |

### 2. Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

Examples:
```
feat(git): add commit graph visualization
fix(fs): handle spaces in folder paths
docs(arch): update feature creation guide
```

### 3. Pull Request Template

When opening a PR, include:

- **What:** Brief description of changes
- **Why:** The problem being solved or feature being added
- **How:** High-level approach taken
- **Testing:** How you verified the changes work
- **Screenshots:** For UI changes

### 4. Review Process

1. All PRs require at least one approving review
2. CI checks must pass (lint, typecheck, build)
3. All commits must be signed
4. Squash merge is preferred for clean history

### 5. Apache 2.0 License Compliance

Since Dragit is licensed under **Apache License 2.0**:

- If you add significant third-party code, update the `NOTICE` file
- Ensure any dependencies are compatible with Apache 2.0
- Include proper attribution for external code

---

## Reporting Issues

### Bug Reports

When reporting bugs, include:

1. **Environment:** OS, Node.js version, Electron version
2. **Steps to Reproduce:** Detailed steps to trigger the bug
3. **Expected Behavior:** What should happen
4. **Actual Behavior:** What actually happens
5. **Screenshots/Logs:** If applicable

### Feature Requests

For feature requests:

1. **Problem:** What problem does this solve?
2. **Solution:** Your proposed solution
3. **Alternatives:** Other solutions you considered
4. **Mockups:** For UI features, rough sketches help

---

## Getting Help

- 📖 **[Architecture Guide](ARCHITECTURE.md)** — Understand the codebase
- 💬 **Discussions** — Ask questions and share ideas
- 🐛 **Issues** — Report bugs or request features

---

## Recognition

Contributors will be recognized in:

- The project's contributor list
- Release notes for significant contributions
- Special mentions for exceptional contributions

---

<p align="center">
  <strong>Thank you for helping make DragIt for everyone! 🚀</strong>
</p>
