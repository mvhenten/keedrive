import type { Entry } from './types.js';

const app = () => document.getElementById('app')!;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function linkFromUrl(raw: string): { href: string; host: string } {
  const hasScheme = /^[a-z][\w+.-]*:\/\//i.test(raw);
  const candidate = hasScheme ? raw : `https://${raw}`;
  try {
    const parsed = new URL(candidate);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return { href: '#', host: raw };
    }
    return { href: parsed.href, host: parsed.hostname };
  } catch {
    return { href: '#', host: raw };
  }
}

export function showLanding(onOpen?: () => void): void {
  app().innerHTML = `
    <div class="landing">
      <h1>KeeDrive</h1>
      <p>Open a .kdbx file from Google Drive to view your passwords.</p>
      ${onOpen ? '<button id="open-drive-btn" class="primary">Open from Drive</button>' : ''}
    </div>
  `;
  
  if (onOpen) {
    document.getElementById('open-drive-btn')!.addEventListener('click', onOpen);
  }
}

export function showLoading(message: string): void {
  app().innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>${escapeHtml(message)}</p>
    </div>
  `;
}

export function showUnlock(
  fileName: string,
  onUnlock: (password: string, keyFile?: File) => void,
): void {
  app().innerHTML = `
    <div class="unlock">
      <h2>Unlock ${escapeHtml(fileName)}</h2>
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
        <h2>${escapeHtml(fileName)}</h2>
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
      .map((e) => {
        const link = e.url ? linkFromUrl(e.url) : null;
        return `
      <div class="entry" data-uuid="${escapeHtml(e.uuid)}">
        <div class="entry-main">
          <strong>${escapeHtml(e.title)}</strong>
          ${e.username ? `<span class="username">${escapeHtml(e.username)}</span>` : ''}
          ${link ? `<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener">${escapeHtml(link.host)}</a>` : ''}
        </div>
      </div>
    `;
      })
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
  const link = entry.url ? linkFromUrl(entry.url) : null;
  entriesEl.innerHTML = `
    <div class="entry-detail">
      <button id="back-btn">← Back</button>
      <h3>${escapeHtml(entry.title)}</h3>
      <div class="detail-field">
        <label>Username</label>
        <div class="field-value">
          <span>${entry.username ? escapeHtml(entry.username) : '—'}</span>
          ${entry.username ? '<button class="copy-btn" data-value="username">Copy</button>' : ''}
        </div>
      </div>
      <div class="detail-field">
        <label>Password</label>
        <div class="field-value">
          <span id="password-value">${entry.password ? '••••••••' : '—'}</span>
          ${entry.password ? '<button class="reveal-btn" id="reveal-btn" type="button" aria-label="Show password" title="Show password">👁</button>' : ''}
          ${entry.password ? '<button class="copy-btn" data-value="password">Copy</button>' : ''}
        </div>
      </div>
      <div class="detail-field">
        <label>URL</label>
        <div class="field-value">
          ${link ? `<a href="${escapeHtml(link.href)}" target="_blank" rel="noopener">${escapeHtml(entry.url)}</a>` : '<span>—</span>'}
        </div>
      </div>
      ${entry.notes ? `<div class="detail-field"><label>Notes</label><pre>${escapeHtml(entry.notes)}</pre></div>` : ''}
      ${entry.extra
        .map(
          (f) =>
            `<div class="detail-field"><label>${escapeHtml(f.label)}</label><pre>${escapeHtml(f.value)}</pre></div>`,
        )
        .join('')}
    </div>
  `;

  document.getElementById('back-btn')!.addEventListener('click', onBack);

  const revealBtn = document.getElementById('reveal-btn');
  if (revealBtn) {
    const passwordValue = document.getElementById('password-value')!;
    revealBtn.addEventListener('click', () => {
      const revealed = passwordValue.textContent !== '••••••••';
      passwordValue.textContent = revealed ? '••••••••' : entry.password;
      revealBtn.textContent = revealed ? '👁' : '🙈';
      const label = revealed ? 'Show password' : 'Hide password';
      revealBtn.setAttribute('aria-label', label);
      revealBtn.setAttribute('title', label);
    });
  }

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
      <p>${escapeHtml(message)}</p>
      <button onclick="location.reload()">Reload</button>
    </div>
  `;
}
