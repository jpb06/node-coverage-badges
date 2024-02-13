import { Effect } from 'effect';
import {
  ensureDir as fsEnsureDir,
  emptyDir as fsEmptyDir,
  readJson as fsReadJson,
  writeFile as fsWriteFile,
} from 'fs-extra';

class FsError {
  readonly _tag = 'fs-error';
  readonly message: string;
  readonly stack?: string;

  constructor(e: unknown) {
    this.message = e instanceof Error ? e.message : String(e);
    this.stack = e instanceof Error ? e.stack : '';
  }
}

export const ensureDir = (path: string) =>
  Effect.tryPromise({
    try: () => fsEnsureDir(path),
    catch: (e) => new FsError(e),
  });

export const emptyDir = (path: string) =>
  Effect.tryPromise({
    try: () => fsEmptyDir(path),
    catch: (e) => new FsError(e),
  });

export const readJson = <TResult>(path: string) =>
  Effect.tryPromise({
    try: () => fsReadJson(path) as Promise<TResult>,
    catch: (e) => new FsError(e),
  });

export const writeFile = (path: string, data: string) =>
  Effect.tryPromise({
    try: () => fsWriteFile(path, data, { encoding: 'utf8' }),
    catch: (e) => new FsError(e),
  });
