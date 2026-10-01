# Contributing to Selective Control

Thank you for your interest in contributing!

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a feature branch: `git checkout -b feature/your-feature`
5. Make your changes
6. Run checks: `npm run typecheck && npm run lint`
7. Build: `npm run build`
8. Test in Chrome (see [docs/development.md](docs/development.md))
9. Commit and push
10. Open a Pull Request

## Development Setup

See [docs/development.md](docs/development.md) for detailed development instructions.

## Adding a New Site

1. Add a `SiteConfig` entry in `src/config/sites.ts`
2. Create `src/content/<site-id>/` directory
3. Implement blocker classes that satisfy the `SiteBlocker` interface
4. Create an entry `index.ts` that registers blockers with a `RuleEngine`
5. Add a content script entry in `manifest.json`
6. Test thoroughly

## Code Style

- Write TypeScript (no `any` types unless absolutely necessary)
- Use meaningful variable names
- Add comments only for non-obvious decisions
- Follow existing patterns in the codebase

## Commit Messages

Use clear, descriptive commit messages:
- `feat: add TikTok For You page blocking`
- `fix: YouTube Shorts not hidden on search results`
- `docs: update supported sites list`
- `refactor: extract common observer logic`

## Pull Request Guidelines

- One feature/fix per PR
- Include a clear description of what changed and why
- Ensure all checks pass
- Test the extension manually in Chrome

## Reporting Issues

- Use the issue templates
- Include browser version and OS
- Describe the expected vs actual behavior
- Include screenshots if applicable

## Code of Conduct

Be respectful and constructive. We're all here to build something useful.
