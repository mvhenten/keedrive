# KeeDrive

A minimal KeePass `.kdbx` viewer for Google Drive. Open files directly using the Drive Picker.

**Live:** https://mvhenten.github.io/keedrive/

## Features

- Read-only access to KeePass databases from Google Drive
- Browse and select files using the Drive Picker
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

See [SETUP.md](./SETUP.md) for Google Cloud Console setup.

## How It Works

1. Visit the app and click **"Open from Drive"**
2. Authorize with Google (OAuth)
3. Select a `.kdbx` file from the Drive Picker
4. Enter your database password (and optional key file)
5. Browse your passwords securely in the browser

## Tech Stack

- Vanilla TypeScript (ES2022)
- [kdbxweb](https://github.com/keeweb/kdbxweb) for KeePass database handling
- [argon2-browser](https://github.com/antelle/argon2-browser) for cryptography
- esbuild for bundling
- Google Identity Services for OAuth
- Google Drive API v3
- Google Picker API for file selection
