import { CLIENT_ID, SCOPE } from './config.js';
import type { DriveState, DriveFile } from './types.js';

// Minimal GIS type declarations
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
};

let accessToken: string | null = null;

export function parseDriveState(): DriveState | null {
  const params = new URLSearchParams(window.location.search);
  const stateParam = params.get('state');
  if (!stateParam) return null;

  try {
    const state = JSON.parse(decodeURIComponent(stateParam)) as DriveState;
    if (state.action === 'open' && state.ids && state.ids.length > 0) {
      return state;
    }
  } catch {
    return null;
  }
  return null;
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
