import * as kdbxweb from 'kdbxweb';
import type { Entry } from './types.js';
// argon2-browser provides WebAssembly-based argon2 for kdbxweb.
// This is the simplest production-ready option that works in browsers without extra setup.
import argon2 from 'argon2-browser';

// Initialize argon2 implementation for kdbxweb
kdbxweb.CryptoEngine.setArgon2Impl((password, salt, memory, iterations, length, parallelism) => {
  return argon2
    .hash({
      pass: new Uint8Array(password),
      salt: new Uint8Array(salt),
      mem: memory,
      time: iterations,
      hashLen: length,
      parallelism,
      type: argon2.ArgonType.Argon2d,
    })
    .then((result: { hash: Uint8Array }) => result.hash.buffer as ArrayBuffer);
});

let currentDb: kdbxweb.Kdbx | null = null;

export async function loadVault(
  buffer: ArrayBuffer,
  password: string,
  keyFileBytes?: ArrayBuffer,
): Promise<Entry[]> {
  const credentials = new kdbxweb.Credentials(
    kdbxweb.ProtectedValue.fromString(password),
    keyFileBytes || null,
  );

  currentDb = await kdbxweb.Kdbx.load(buffer, credentials);

  const entries: Entry[] = [];

  function fieldText(value: string | kdbxweb.ProtectedValue | undefined): string {
    if (!value) return '';
    if (value instanceof kdbxweb.ProtectedValue) return value.getText();
    return value.toString();
  }

  const standardFields = new Set(['Title', 'UserName', 'Password', 'URL', 'Notes']);

  function traverseGroup(group: kdbxweb.KdbxGroup) {
    for (const entry of group.entries) {
      // Skip meta entries, recycle bin entries, etc.
      if (entry.fields.get('Title')) {
        const extra: Array<{ label: string; value: string }> = [];
        for (const [label, value] of entry.fields) {
          if (standardFields.has(label)) continue;
          const text = fieldText(value);
          if (text) extra.push({ label, value: text });
        }

        entries.push({
          uuid: entry.uuid.id || '',
          title: fieldText(entry.fields.get('Title')),
          username: fieldText(entry.fields.get('UserName')),
          password: fieldText(entry.fields.get('Password')),
          url: fieldText(entry.fields.get('URL')),
          notes: fieldText(entry.fields.get('Notes')),
          extra,
        });
      }
    }

    for (const subGroup of group.groups) {
      traverseGroup(subGroup);
    }
  }

  if (currentDb.groups && currentDb.groups.length > 0) {
    traverseGroup(currentDb.groups[0]);
  }

  return entries;
}

export function lockVault(): void {
  currentDb = null;
}
