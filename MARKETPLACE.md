# Google Workspace Marketplace Listing — Copy/Paste Cheat Sheet

> All values to paste into the Google Workspace Marketplace SDK forms.  
> **Project number:** `740964302491`

---

## Step 1: Enable the Marketplace SDK

**URL:** https://console.cloud.google.com/apis/library/appsmarket-component.googleapis.com?project=740964302491

**Action:** Click **Enable**.

---

## Step 2: App Configuration

**URL:** https://console.cloud.google.com/apis/api/appsmarket-component.googleapis.com/googleappsmarket?project=740964302491

*(If the direct link doesn't work: navigate to **APIs & Services → Google Workspace Marketplace SDK → App Configuration**)*

### Fields

- **App visibility:** `Private` *(or "My Domain" if you have a Workspace)*
- **Installation settings:** Enable both:
  - ☑ Individual install
  - ☑ Admin install
- **App integration:** Enable:
  - ☑ **Drive extension** *(already configured)*
- **OAuth scopes:** Paste exactly:
  ```
  https://www.googleapis.com/auth/drive.file
  ```
- **Developer website:** `https://github.com/mvhenten`
- **Terms of service URL:** `https://mvhenten.github.io/keedrive/legal/terms.html`
- **Privacy policy URL:** `https://mvhenten.github.io/keedrive/legal/privacy.html`

**Save** before proceeding to Store Listing.

---

## Step 3: Store Listing

*(Same SDK page, switch to **Store Listing** tab)*

### Basic Information

- **App name:** `KeeDrive`
- **Short description** *(max 80 chars):*
  ```
  View your KeePass (.kdbx) vaults directly from Google Drive in your browser.
  ```
- **Detailed description:**
  ```
  KeeDrive is a secure, client-side KeePass password vault viewer that integrates directly with Google Drive. Open your .kdbx files from Drive, unlock them with your password and optional key file, and view your stored passwords—all without leaving your browser.

  **Security First:** KeeDrive runs entirely in your browser. There is no backend server. Your password and decrypted vault contents never leave your device. The app only accesses files you explicitly open with it (OAuth scope: drive.file). Decryption happens locally using the kdbxweb library, and the vault auto-locks after 5 minutes of inactivity.

  **Current Limitations:** KeeDrive is read-only (v1). It supports KDBX 3.1 and 4.0 formats. For editing, use the full KeePass desktop client or KeePassXC. KeeDrive is open source: https://github.com/mvhenten/keedrive
  ```

### Media

- **Application icon (128×128):**
  ```
  https://mvhenten.github.io/keedrive/icons/icon-128.png
  ```
- **Banner (220×140):**  
  *(If required, use the icon temporarily. If rejected, generate a proper banner.)*
  ```
  https://mvhenten.github.io/keedrive/icons/icon-128.png
  ```
- **Screenshots (1280×800, at least one required):**
  ```
  https://mvhenten.github.io/keedrive/marketplace/screenshot-unlock.png
  ```

### Feature Highlights

*(Paste into "Features" or "Detailed description headline" if prompted)*

- ✅ **Client-side decryption** — your password never leaves your browser
- ✅ **Minimal permissions** — only accesses files you open with KeeDrive
- ✅ **Auto-lock** — vault locks after 5 minutes of inactivity
- ✅ **KeePass 3.1 & 4.0 support** — compatible with modern .kdbx formats
- ✅ **Optional key file support** — use a key file for two-factor protection
- ✅ **Open source** — audit the code at github.com/mvhenten/keedrive

### Additional Details

- **Category:** `Productivity`
- **Language:** `English`
- **Support URL:** `https://github.com/mvhenten/keedrive/issues`
- **Support email:** `mvhenten+keedrive@gmail.com`  
  **⚠️ CHANGE THIS TO YOUR REAL EMAIL BEFORE PUBLISHING**
- **Terms of service:** `https://mvhenten.github.io/keedrive/legal/terms.html`
- **Privacy policy:** `https://mvhenten.github.io/keedrive/legal/privacy.html`
- **Distribution regions:** Select **All regions** *(or restrict if needed)*

**Save draft**.

---

## Step 4: Publish & Install

1. **Publish:**
   - Click **Publish** (top-right).
   - For a **private** listing, there is no Google review—it's instant.
   - Confirm the publish action.

2. **Install the app:**
   - After publish, the listing page will show an **Install** button (or link).
   - Click **Install** → grant the `drive.file` scope → confirm.

3. **Verify in Google Drive:**
   - Go to [drive.google.com](https://drive.google.com).
   - Upload a test `.kdbx` file (or use an existing one).
   - Right-click the file → **Open with** → **KeeDrive** should appear.
   - Click it. The app should open, show the unlock screen, and work as expected.

---

## Notes

- **Support email** (`mvhenten+keedrive@gmail.com`) is a placeholder. Update it to your real email before publishing.
- If the **banner (220×140)** is strictly required and the icon is rejected, generate one using a script like `scripts/gen-banner.mjs` (not included; adapt from icon generation if needed).
- **Private listings** do not appear in the public Marketplace search; only you (or your Workspace domain) can install them.
- If you later want to make the listing **public**, you'll need to submit it for Google review (can take several days).
- The **OAuth client** and **Drive integration** must already be configured in the same Cloud project (740964302491). If not, see `SETUP.md` or the Drive API integration docs.

---

## Troubleshooting

- **"App not appearing in Open with":** Ensure the Drive integration is enabled in the OAuth consent screen and that you've installed the app from the Marketplace listing (Step 4).
- **"Scope not granted":** Check that `https://www.googleapis.com/auth/drive.file` is listed in both the Marketplace SDK configuration and the OAuth consent screen.
- **"Banner image rejected":** The Marketplace SDK sometimes requires a 220×140 banner. If so, create one (e.g., using a design tool or adapt the icon generation script to produce a banner).

---

*This listing was prepared with KeeDrive v0.1.0. Update screenshots and descriptions as the app evolves.*
