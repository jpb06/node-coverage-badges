import { Effect } from 'effect';
import { TaggedError } from 'effect/Data';
import {
  ensureDir as fsEnsureDir,
  emptyDir as fsEmptyDir,
  readJson as fsReadJson,
  writeFile as fsWriteFile,
} from 'fs-extra';

export class FsError extends TaggedError('fs-error')<{
  cause?: unknown;
  message?: string;
}> {}

export const ensureDir = (path: string) =>
  Effect.tryPromise({
    try: () => fsEnsureDir(path),
    catch: (e) => new FsError({ cause: e }),
  });

export const emptyDir = (path: string) =>
  Effect.tryPromise({
    try: () => fsEmptyDir(path),
    catch: (e) => new FsError({ cause: e }),
  });

export const readJson = <TResult>(path: string) =>
  Effect.tryPromise({
    try: () => fsReadJson(path) as Promise<TResult>,
    catch: (e) => new FsError({ cause: e }),
  });

export const writeFile = (path: string, data: string) =>
  Effect.tryPromise({
    try: () => fsWriteFile(path, data, { encoding: 'utf8' }),
    catch: (e) => new FsError({ cause: e }),
  });
