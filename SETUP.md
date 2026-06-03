# Google Cloud Console Setup

KeeDrive uses the Google Drive Picker to let users select `.kdbx` files from their Drive. No Marketplace integration or "Open with" menu needed.

---

## Step 1: Enable Drive API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select project `keedrive-498312` (or create a new one)
3. Navigate to **APIs & Services** → **Library**
4. Search for "Google Drive API" and enable it

## Step 2: Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Set **User type:** External
3. Set **Publishing status:** Testing (no review needed)
4. Add **Scope:** `https://www.googleapis.com/auth/drive.file`
5. Add **Test users:** your Google account email(s)

## Step 3: Create OAuth Web Client

1. Go to **APIs & Services** → **Credentials** → **Create Credentials** → **OAuth client ID**
2. **Application type:** Web application
3. **Authorized JavaScript origins:** `https://mvhenten.github.io`
4. Copy the **Client ID** and update `src/config.ts`

## Step 4: Deploy

Push to `main` branch. GitHub Actions will build and deploy to GitHub Pages.

## Testing

1. Visit https://mvhenten.github.io/keedrive/
2. Click **"Open from Drive"**
3. Authorize the app (Google will show a testing consent screen)
4. Select a `.kdbx` file from the Drive Picker
5. Enter your database password (and key file if needed)

## Notes

- Public OAuth client IDs are not secrets — they're hardcoded in `src/config.ts`
- The app only requests `drive.file` scope (access to files the user explicitly selects)
- Passwords are never logged or stored
- OAuth token is kept in memory only
- Auto-lock after 5 minutes of inactivity
- No Marketplace review or "Open with" integration needed
