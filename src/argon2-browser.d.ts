declare module 'argon2-browser' {
  export enum ArgonType {
    Argon2d = 0,
    Argon2i = 1,
    Argon2id = 2,
  }

  export function hash(options: {
    pass: Uint8Array;
    salt: Uint8Array;
    mem: number;
    time: number;
    hashLen: number;
    parallelism: number;
    type: ArgonType;
  }): Promise<{ hash: Uint8Array }>;

  const argon2: {
    ArgonType: typeof ArgonType;
    hash: typeof hash;
  };

  export default argon2;
}
