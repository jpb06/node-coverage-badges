import { Effect } from 'effect';
import { TaggedError } from 'effect/Data';
import {
  ensureDir as fsEnsureDir,
  readJson as fsReadJson,
  writeFile as fsWriteFile,
  readdir as fsReadDir,
  rm as fsRm,
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

export const readDir = (path: string) =>
  Effect.tryPromise({
    try: () => fsReadDir(path),
    catch: (e) => new FsError({ cause: e }),
  });

export const rm = (path: string) =>
  Effect.tryPromise({
    try: () => fsRm(path),
    catch: (e) => new FsError({ cause: e }),
  });

export const removeFiles = (path: string, extension: string) =>
  Effect.gen(function* () {
    const files = yield* readDir(path);

    const removeEffects = files
      .filter((file) => file.endsWith(extension))
      .map((file) => rm(file));

    return yield* Effect.all(removeEffects, { concurrency: 'unbounded' });
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
