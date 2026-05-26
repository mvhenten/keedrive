import type { Entry } from './types.js';

const app = () => document.getElementById('app')!;

export function showLanding(): void {
  app().innerHTML = `
    <div class="landing">
      <h1>KeeDrive</h1>
      <p>Open a .kdbx file from Google Drive to view your passwords.</p>
      <p class="hint">Use "Open with → KeeDrive" from Google Drive.</p>
    </div>
  `;
}

export function showLoading(message: string): void {
  app().innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>${message}</p>
    </div>
  `;
}

export function showUnlock(
  fileName: string,
  onUnlock: (password: string, keyFile?: File) => void,
): void {
  app().innerHTML = `
    <div class="unlock">
      <h2>Unlock ${fileName}</h2>
      <form id="unlock-form">
        <label>
          Password
          <input type="password" id="password" required autocomplete="off" />
        </label>
        <label>
          Key File (optional)
          <input type="file" id="keyfile" />
        </label>
        <button type="submit">Unlock</button>
      </form>
    </div>
  `;

  const form = document.getElementById('unlock-form') as HTMLFormElement;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const password = (document.getElementById('password') as HTMLInputElement).value;
    const keyFileInput = document.getElementById('keyfile') as HTMLInputElement;
    const keyFile = keyFileInput.files?.[0];
    onUnlock(password, keyFile);
  });
}

export function showVault(entries: Entry[], fileName: string, onLock: () => void): void {
  app().innerHTML = `
    <div class="vault">
      <header>
        <h2>${fileName}</h2>
        <div class="actions">
          <input type="search" id="search" placeholder="Search..." />
          <button id="lock-btn">Lock</button>
        </div>
      </header>
      <div id="entries"></div>
    </div>
  `;

  document.getElementById('lock-btn')!.addEventListener('click', onLock);

  const searchInput = document.getElementById('search') as HTMLInputElement;
  const renderEntries = (filter: string) => {
    const filtered = entries.filter(
      (e) =>
        e.title.toLowerCase().includes(filter) ||
        e.username.toLowerCase().includes(filter) ||
        e.url.toLowerCase().includes(filter),
    );

    const entriesEl = document.getElementById('entries')!;
    entriesEl.innerHTML = filtered
      .map(
        (e) => `
      <div class="entry" data-uuid="${e.uuid}">
        <div class="entry-main">
          <strong>${e.title}</strong>
          ${e.username ? `<span class="username">${e.username}</span>` : ''}
          ${e.url ? `<a href="${e.url}" target="_blank" rel="noopener">${new URL(e.url).hostname}</a>` : ''}
        </div>
      </div>
    `,
      )
      .join('');

    entriesEl.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const entryEl = target.closest('.entry') as HTMLElement | null;
      if (entryEl) {
        const uuid = entryEl.dataset.uuid!;
        const entry = entries.find((e) => e.uuid === uuid)!;
        showEntryDetail(entry, () => renderEntries(searchInput.value.toLowerCase()));
      }
    });
  };

  searchInput.addEventListener('input', () => {
    renderEntries(searchInput.value.toLowerCase());
  });

  renderEntries('');
}

function showEntryDetail(entry: Entry, onBack: () => void): void {
  const entriesEl = document.getElementById('entries')!;
  entriesEl.innerHTML = `
    <div class="entry-detail">
      <button id="back-btn">← Back</button>
      <h3>${entry.title}</h3>
      <div class="detail-field">
        <label>Username</label>
        <div class="field-value">
          <span>${entry.username || '—'}</span>
          ${entry.username ? '<button class="copy-btn" data-value="username">Copy</button>' : ''}
        </div>
      </div>
      <div class="detail-field">
        <label>Password</label>
        <div class="field-value">
          <span>••••••••</span>
          ${entry.password ? '<button class="copy-btn" data-value="password">Copy</button>' : ''}
        </div>
      </div>
      <div class="detail-field">
        <label>URL</label>
        <div class="field-value">
          ${entry.url ? `<a href="${entry.url}" target="_blank" rel="noopener">${entry.url}</a>` : '<span>—</span>'}
        </div>
      </div>
      ${entry.notes ? `<div class="detail-field"><label>Notes</label><pre>${entry.notes}</pre></div>` : ''}
    </div>
  `;

  document.getElementById('back-btn')!.addEventListener('click', onBack);

  entriesEl.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const field = (btn as HTMLElement).dataset.value!;
      const value = field === 'username' ? entry.username : entry.password;
      await copyToClipboard(value);
      btn.textContent = 'Copied!';
      setTimeout(() => {
        btn.textContent = 'Copy';
      }, 2000);
    });
  });
}

async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
  // Best-effort clear after 20s
  setTimeout(async () => {
    try {
      await navigator.clipboard.writeText(' ');
      await navigator.clipboard.writeText('');
    } catch {
      // Ignore errors
    }
  }, 20000);
}

export function showError(message: string): void {
  app().innerHTML = `
    <div class="error">
      <h2>Error</h2>
      <p>${message}</p>
      <button onclick="location.reload()">Reload</button>
    </div>
  `;
}
