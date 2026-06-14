export interface Entry {
  uuid: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
  extra: Array<{ label: string; value: string }>;
}

export interface DriveFile {
  id: string;
  name: string;
  content: ArrayBuffer;
}

// GIS and gapi ready flags set by index.html onload
declare global {
  interface Window {
    __gisReady?: boolean;
    __gapiReady?: boolean;
  }
}
