import { parseDriveState, authorize, downloadFile } from './drive.js';
import { loadVault, lockVault } from './vault.js';
import { showLanding, showLoading, showUnlock, showVault, showError } from './ui.js';
import type { DriveFile, Entry } from './types.js';

let currentFile: DriveFile | null = null;
let currentEntries: Entry[] | null = null;
let idleTimer: number | null = null;

const IDLE_TIMEOUT = 5 * 60 * 1000; // 5 minutes

function resetIdleTimer() {
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => {
    if (currentEntries) {
      handleLock();
    }
  }, IDLE_TIMEOUT);
}

function handleLock() {
  lockVault();
  currentEntries = null;
  if (idleTimer) clearTimeout(idleTimer);
  if (currentFile) {
    showUnlock(currentFile.name, handleUnlock);
  } else {
    showLanding();
  }
}

async function handleUnlock(password: string, keyFile?: File) {
  if (!currentFile) return;

  try {
    showLoading('Unlocking vault...');

    let keyFileBytes: ArrayBuffer | undefined;
    if (keyFile) {
      keyFileBytes = await keyFile.arrayBuffer();
    }

    currentEntries = await loadVault(currentFile.content, password, keyFileBytes);
    showVault(currentEntries, currentFile.name, handleLock);
    resetIdleTimer();

    // Reset idle timer on user activity
    ['mousedown', 'keydown', 'scroll', 'touchstart'].forEach((event) => {
      document.addEventListener(event, resetIdleTimer, { passive: true });
    });
  } catch (error) {
    showError(`Failed to unlock vault: ${(error as Error).message}`);
  }
}

async function main() {
  // Wait for GIS script to load if it hasn't yet
  if (!window.__gisReady) {
    await new Promise<void>((resolve) => window.addEventListener('gis-ready', () => resolve(), { once: true }));
  }
  try {
    const state = parseDriveState();

    if (!state) {
      showLanding();
      return;
    }

    showLoading('Authorizing...');
    await authorize(state.userId);

    const fileId = state.ids[0];
    showLoading('Downloading file...');
    currentFile = await downloadFile(fileId);

    showUnlock(currentFile.name, handleUnlock);
  } catch (error) {
    showError(`Initialization failed: ${(error as Error).message}`);
  }
}

main();
