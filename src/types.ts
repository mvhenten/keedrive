export interface DriveState {
  ids: string[];
  action: string;
  userId: string;
}

export interface Entry {
  uuid: string;
  title: string;
  username: string;
  password: string;
  url: string;
  notes: string;
}

export interface DriveFile {
  id: string;
  name: string;
  content: ArrayBuffer;
}

// GIS ready flag set by index.html onload
declare global {
  interface Window { __gisReady?: boolean; }
}
