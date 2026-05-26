# Google Cloud Console Setup

**Prerequisites:** [walking-windeck](https://github.com/mvhenten/walking-windeck) is already deployed and working. That means:
- GCP project `740964302491` exists
- Drive API is enabled
- OAuth consent screen is configured
- OAuth web client `740964302491-053r5inogfui83368ftrmh1fqo2ph171.apps.googleusercontent.com` exists
- Authorized JS origin `https://mvhenten.github.io` is set

KeeDrive reuses the same GCP project and OAuth client. Only the Drive UI integration needs configuration.

---

## Step 1: Configure Drive UI Integration

1. Go to [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services** → **Drive API** → **Drive UI Integration**
2. Click **Add** and configure:
   - **Application Name:** `KeeDrive`
   - **Short Description:** `KeePass password manager`
   - **Long Description:** `Open and view KeePass .kdbx files from Google Drive`
   - **Open URL:** `https://mvhenten.github.io/keedrive/`
   - **Default MIME types:** `application/octet-stream`
   - **Default file extensions:** `kdbx`
   - **Import formats:** (leave blank)
   - **Creating new files:** unchecked
   - **Opening files:** checked
3. Upload icons (optional but recommended)
4. Save

## Step 2: Verify OAuth Client

1. Go to **APIs & Services** → **Credentials** → OAuth client `740964302491-053r5inogfui83368ftrmh1fqo2ph171.apps.googleusercontent.com`
2. Confirm **Authorized JavaScript origins** includes:
   - `https://mvhenten.github.io`
3. No changes needed if walking-windeck is already working.

## Step 3: Add OAuth Scope

1. Go to **APIs & Services** → **OAuth consent screen**
2. Under **Scopes**, ensure both are present:
   - `https://www.googleapis.com/auth/drive.appdata` (walking-windeck)
   - `https://www.googleapis.com/auth/drive.file` (KeeDrive)
3. Save if you added the new scope.

## Step 4: Deploy

Push to `main` branch. GitHub Actions will build and deploy to GitHub Pages — **no repository variables needed** (the OAuth client ID is hardcoded).

## Testing

1. Open Google Drive
2. Right-click a `.kdbx` file
3. Select **Open with** → **KeeDrive**
4. Authorize the app (same consent screen as walking-windeck)
5. Enter your database password (and key file if needed)

## Notes

- Public OAuth client IDs are not secrets — they're hardcoded like in walking-windeck
- The app only requests `drive.file` scope (access to files opened/created by the app)
- Passwords are never logged or stored
- OAuth token is kept in memory only
- Auto-lock after 5 minutes of inactivity
