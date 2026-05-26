# KeeDrive

A minimal Google Drive "Open with" handler for KeePass `.kdbx` files.

**Live:** https://mvhenten.github.io/keedrive/

## Features

- Read-only access to KeePass databases from Google Drive
- No frameworks, vanilla TypeScript
- Secure: passwords never logged or stored
- Auto-lock after 5 minutes idle
- Light/dark mode support

## Development

```bash
npm install
npm run typecheck   # Type check
npm run build       # Production build
npm run dev         # Dev server with watch mode
npm run fix         # Format code
```

## Setup

See [SETUP.md](./SETUP.md) for Google Cloud Console configuration.

## Tech Stack

- Vanilla TypeScript (ES2022)
- [kdbxweb](https://github.com/keeweb/kdbxweb) for KeePass database handling
- [argon2-browser](https://github.com/antelle/argon2-browser) for cryptography
- esbuild for bundling
- Google Identity Services for OAuth
- Google Drive API v3
