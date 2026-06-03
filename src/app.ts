import { waitForGapi, authorize, downloadFile, openPicker } from './drive.js';
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

async function handleOpenFromDrive() {
  try {
    showLoading('Authorizing...');
    const token = await authorize('');

    showLoading('Opening picker...');
    const fileId = await openPicker(token);

    showLoading('Downloading file...');
    currentFile = await downloadFile(fileId);

    showUnlock(currentFile.name, handleUnlock);
  } catch (error) {
    const message = (error as Error).message;
    if (message === 'Picker cancelled') {
      showLanding(handleOpenFromDrive);
    } else {
      showError(`Failed to open file: ${message}`);
    }
  }
}

async function main() {
  // Wait for both GIS and gapi scripts to load
  const promises: Promise<void>[] = [];
  
  if (!window.__gisReady) {
    promises.push(
      new Promise<void>((resolve) => window.addEventListener('gis-ready', () => resolve(), { once: true }))
    );
  }
  
  if (!window.__gapiReady) {
    promises.push(
      new Promise<void>((resolve) => window.addEventListener('gapi-ready', () => resolve(), { once: true }))
    );
  }
  
  await Promise.all(promises);
  
  try {
    // Load the picker library
    await waitForGapi();
    
    // Show landing with "Open from Drive" button
    showLanding(handleOpenFromDrive);
  } catch (error) {
    showError(`Initialization failed: ${(error as Error).message}`);
  }
}

main();
