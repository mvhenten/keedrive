import { CLIENT_ID, SCOPE } from './config.js';
import type { DriveFile } from './types.js';

// Minimal GIS and gapi type declarations
declare const google: {
  accounts: {
    oauth2: {
      initTokenClient(config: {
        client_id: string;
        scope: string;
        callback: (response: { access_token?: string; error?: string }) => void;
        error_callback?: (error: unknown) => void;
        hint?: string;
      }): {
        requestAccessToken(): void;
      };
    };
  };
  picker: {
    PickerBuilder: new () => PickerBuilderType;
    ViewId: { DOCS: unknown };
    DocsView: new (viewId: unknown) => DocsViewType;
    Action: { PICKED: string; CANCEL: string };
  };
};

interface PickerBuilderType {
  addView(view: DocsViewType): PickerBuilderType;
  setOAuthToken(token: string): PickerBuilderType;
  setDeveloperKey(key: string): PickerBuilderType;
  setCallback(callback: (data: PickerCallbackData) => void): PickerBuilderType;
  build(): { setVisible(visible: boolean): void };
}

interface DocsViewType {
  setMimeTypes(mimeTypes: string): DocsViewType;
  setQuery(query: string): DocsViewType;
}

declare const gapi: {
  load(api: string, callback: () => void): void;
};

interface PickerCallbackData {
  action: string;
  docs?: Array<{ id: string; name: string }>;
}

let accessToken: string | null = null;

export async function waitForGapi(): Promise<void> {
  // Wait for gapi script to load if it hasn't yet
  if (!window.__gapiReady) {
    await new Promise<void>((resolve) => {
      window.addEventListener('gapi-ready', () => resolve(), { once: true });
    });
  }

  // Load the picker library
  return new Promise<void>((resolve, reject) => {
    try {
      gapi.load('picker', () => resolve());
    } catch (error) {
      reject(error);
    }
  });
}

export async function openPicker(accessTokenParam: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const docsView = new google.picker.DocsView(google.picker.ViewId.DOCS)
      .setMimeTypes('application/octet-stream')
      .setQuery('.kdbx');

    const picker = new google.picker.PickerBuilder()
      .addView(docsView)
      .setOAuthToken(accessTokenParam)
      .setCallback((data: PickerCallbackData) => {
        if (data.action === google.picker.Action.PICKED) {
          if (data.docs && data.docs.length > 0) {
            resolve(data.docs[0].id);
          } else {
            reject(new Error('No file selected'));
          }
        } else if (data.action === google.picker.Action.CANCEL) {
          reject(new Error('Picker cancelled'));
        }
      })
      .build();

    picker.setVisible(true);
  });
}

export async function authorize(userId: string): Promise<string> {
  if (accessToken) return accessToken;

  return new Promise((resolve, reject) => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPE,
      callback: (response) => {
        if (response.access_token) {
          accessToken = response.access_token;
          resolve(accessToken);
        } else {
          reject(new Error(response.error || 'Authorization failed'));
        }
      },
      error_callback: (error) => reject(error),
      hint: userId,
    });

    client.requestAccessToken();
  });
}

export async function downloadFile(fileId: string): Promise<DriveFile> {
  if (!accessToken) throw new Error('Not authorized');

  // Fetch file metadata (name)
  const metaResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?fields=name`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!metaResponse.ok) {
    throw new Error(`Failed to fetch file metadata: ${metaResponse.statusText}`);
  }

  const meta = (await metaResponse.json()) as { name: string };

  // Fetch file content
  const contentResponse = await fetch(
    `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    },
  );

  if (!contentResponse.ok) {
    throw new Error(`Failed to download file: ${contentResponse.statusText}`);
  }

  const content = await contentResponse.arrayBuffer();

  return {
    id: fileId,
    name: meta.name,
    content,
  };
}
