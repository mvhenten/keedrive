# Google Cloud Console Setup

Step-by-step guide to configure KeeDrive with Google Drive API.

## 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (e.g., "KeeDrive")
3. Note your project ID

## 2. Enable Google Drive API

1. Navigate to **APIs & Services** → **Library**
2. Search for "Google Drive API"
3. Click **Enable**

## 3. Configure OAuth Consent Screen

1. Go to **APIs & Services** → **OAuth consent screen**
2. Select **External** user type
3. Fill in required fields:
   - App name: `KeeDrive`
   - User support email: your email
   - Developer contact: your email
4. Add scope: `https://www.googleapis.com/auth/drive.file`
5. Add your Google account to **Test users** (required for External apps in testing)
6. Save and continue

## 4. Create OAuth 2.0 Client ID

1. Go to **APIs & Services** → **Credentials**
2. Click **Create Credentials** → **OAuth client ID**
3. Application type: **Web application**
4. Name: `KeeDrive Web Client`
5. Add **Authorized JavaScript origins**:
   - `https://mvhenten.github.io`
6. Click **Create**
7. Copy your **Client ID** (looks like `123456789-abc.apps.googleusercontent.com`)

## 5. Configure Drive UI Integration

1. In **APIs & Services** → **OAuth consent screen**, scroll to **Drive UI Integration**
2. Click **Add** and configure:
   - **Application Name:** `KeeDrive`
   - **Short Description:** `KeePass password manager`
   - **Long Description:** `Open and view KeePass .kdbx files from Google Drive`
   - **Open URL:** `https://mvhenten.github.io/keedrive/`
   - **MIME types:** `application/octet-stream`
   - **File extensions:** `kdbx`
3. Upload icons (optional but recommended)
4. Save

## 6. Get Application ID

1. After saving Drive UI integration, note the **Application ID** (numeric, e.g., `123456789`)

## 7. Set GitHub Repository Variables

1. Go to your GitHub repository → **Settings** → **Secrets and variables** → **Actions** → **Variables**
2. Add two repository variables:
   - `GOOGLE_CLIENT_ID`: paste your OAuth Client ID
   - `GOOGLE_APP_ID`: paste your Application ID

## 8. Deploy

Push to `main` branch. GitHub Actions will build and deploy to GitHub Pages.

## Testing

1. Open Google Drive
2. Right-click a `.kdbx` file
3. Select **Open with** → **KeeDrive**
4. Authorize the app
5. Enter your database password (and key file if needed)

## Notes

- The app only requests `drive.file` scope (access to files opened/created by the app)
- Passwords are never logged or stored
- OAuth token is kept in memory only
- Auto-lock after 5 minutes of inactivity
