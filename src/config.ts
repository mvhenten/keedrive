// Build-time defines injected by esbuild
declare const __CLIENT_ID__: string;
declare const __APP_ID__: string;

export const CLIENT_ID = __CLIENT_ID__;
export const APP_ID = __APP_ID__;
export const SCOPE = 'https://www.googleapis.com/auth/drive.file';
